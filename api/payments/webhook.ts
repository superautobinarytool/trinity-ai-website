import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createHmac, timingSafeEqual } from "crypto";
import { supabaseAdmin } from "../lib/supabase-admin";
import { generateLicenseKey } from "../lib/license-key";
import { sendLicenseEmail } from "../lib/email";

/* ─── NOWPayments payment statuses that mean "payment complete" ─────────────
   https://documenter.getpostman.com/view/7907941/2s93JusNJt#payment-statuses */
const CONFIRMED_STATUSES = new Set(["finished", "confirmed"]);

/* ─── Handler ────────────────────────────────────────────────────────────── */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  // ── 1. Verify IPN signature (HMAC-SHA512) ─────────────────────────────────
  // NOWPayments signs the alphabetically-sorted JSON of the request body.
  // We re-sort + re-stringify to get the same canonical form they signed.
  const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;

  if (ipnSecret) {
    const receivedSig = req.headers["x-nowpayments-sig"] as string | undefined;

    if (!receivedSig) {
      console.warn("[webhook] Request missing x-nowpayments-sig header — rejected.");
      res.status(401).json({ error: "Missing signature" });
      return;
    }

    const canonicalBody = JSON.stringify(sortKeysDeep(req.body));
    const expectedSig   = createHmac("sha512", ipnSecret)
      .update(canonicalBody)
      .digest("hex");

    // Use timingSafeEqual to prevent timing attacks
    const expected = Buffer.from(expectedSig, "hex");
    const received = Buffer.from(receivedSig, "hex");

    const signaturesMatch =
      expected.length === received.length &&
      timingSafeEqual(expected, received);

    if (!signaturesMatch) {
      console.warn("[webhook] IPN signature mismatch — possible forgery rejected.");
      res.status(401).json({ error: "Invalid signature" });
      return;
    }
  } else {
    // No secret set — log a warning. Block in production; allow in sandbox dev.
    if (process.env.NOWPAYMENTS_SANDBOX !== "true") {
      console.error("[webhook] NOWPAYMENTS_IPN_SECRET is not set in production. Rejecting.");
      res.status(500).json({ error: "Server misconfiguration" });
      return;
    }
    console.warn("[webhook] NOWPAYMENTS_IPN_SECRET not set — skipping sig check (sandbox only).");
  }

  // ── 2. Parse & validate the IPN payload ──────────────────────────────────
  const body = req.body as Record<string, unknown>;
  const { payment_status, order_id, payment_id } = body;

  if (!order_id || typeof order_id !== "string") {
    res.status(400).json({ error: "Missing order_id" });
    return;
  }

  // Acknowledge non-final statuses immediately — NOWPayments retries until 200
  if (!CONFIRMED_STATUSES.has(payment_status as string)) {
    res.status(200).json({ received: true, order_id, status: payment_status });
    return;
  }

  // ── 3. Look up the pending order ──────────────────────────────────────────
  const { data: order, error: orderFetchError } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("order_id", order_id)
    .maybeSingle();

  if (orderFetchError) {
    console.error("[webhook] DB error fetching order:", orderFetchError);
    res.status(500).json({ error: "DB error" });
    return;
  }

  if (!order) {
    console.warn(`[webhook] Order not found: ${order_id}`);
    // Return 200 so NOWPayments doesn't keep retrying an unknown order
    res.status(200).json({ received: true });
    return;
  }

  // ── 4. Idempotency guard — don't issue a second license ───────────────────
  if (order.status === "confirmed") {
    console.info(`[webhook] Order already confirmed: ${order_id} — skipping.`);
    res.status(200).json({ received: true, already_processed: true });
    return;
  }

  // ── 5. Generate a unique license key ──────────────────────────────────────
  let licenseKey: string;
  let attempts = 0;

  while (true) {
    licenseKey = generateLicenseKey();
    attempts++;

    // Ensure uniqueness against existing keys (collision is astronomically rare
    // but we check anyway for correctness)
    const { data: existing } = await supabaseAdmin
      .from("licenses")
      .select("id")
      .eq("license_key", licenseKey)
      .maybeSingle();

    if (!existing) break;
    if (attempts >= 10) {
      console.error("[webhook] Could not generate a unique license key after 10 attempts.");
      res.status(500).json({ error: "License generation failed" });
      return;
    }
  }

  // ── 6. Write the license row ───────────────────────────────────────────────
  const now    = new Date();
  const expiry = new Date(now);
  expiry.setDate(expiry.getDate() + 30); // 30-day subscription cycle

  const { data: license, error: licenseError } = await supabaseAdmin
    .from("licenses")
    .insert({
      customer_name: order.customer_name,
      email:         order.email,
      license_key:   licenseKey!,
      start_date:    now.toISOString(),
      expiry_date:   expiry.toISOString(),
      is_active:     true,
    })
    .select("id")
    .single();

  if (licenseError || !license) {
    console.error("[webhook] Failed to insert license:", licenseError);
    res.status(500).json({ error: "License write failed" });
    return;
  }

  // ── 7. Mark the order as confirmed ────────────────────────────────────────
  const { error: updateError } = await supabaseAdmin
    .from("orders")
    .update({
      status:                   "confirmed",
      nowpayments_payment_id:   String(payment_id ?? ""),
      license_id:               license.id,
      updated_at:               now.toISOString(),
    })
    .eq("order_id", order_id);

  if (updateError) {
    // License was created — log the error but don't fail (email still goes out)
    console.error("[webhook] Failed to update order status:", updateError);
  }

  // ── 8. Send the license email ─────────────────────────────────────────────
  const expiryLabel = expiry.toLocaleDateString("en-US", {
    day:   "numeric",
    month: "long",
    year:  "numeric",
  });

  try {
    await sendLicenseEmail({
      to:           order.email,
      customerName: order.customer_name,
      plan:         order.plan as "starter" | "pro",
      licenseKey:   licenseKey!,
      orderId:      order_id,
      expiryDate:   expiryLabel,
    });
    console.info(`[webhook] License email sent to ${order.email} for order ${order_id}`);
  } catch (emailErr) {
    // Email failure must NOT cause a non-200 response — NOWPayments would retry
    // endlessly and we'd generate duplicate licenses.
    // Log for manual follow-up; the license is safely in the DB.
    console.error("[webhook] Email delivery failed (license IS in DB):", emailErr);
  }

  res.status(200).json({ received: true, order_id, license_id: license.id });
}

/* ─── Utility: recursively sort object keys alphabetically ──────────────────
   Required for NOWPayments HMAC signature verification.                      */
function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value !== null && typeof value === "object") {
    return Object.keys(value as object)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = sortKeysDeep((value as Record<string, unknown>)[key]);
        return acc;
      }, {});
  }
  return value;
}
