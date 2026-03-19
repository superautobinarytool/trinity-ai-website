/**
 * POST /api/payments/webhook
 *
 * NOWPayments IPN (Instant Payment Notification) handler.
 *
 * NOWPayments sends a POST to this URL whenever a payment status changes.
 * Signature is verified using HMAC-SHA512 with the IPN secret from your
 * NOWPayments dashboard. Set NOWPAYMENTS_IPN_SECRET in your environment.
 *
 * This endpoint must return HTTP 200 — if it doesn't, NOWPayments retries.
 */

import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  // ── Parse body ────────────────────────────────────────────────────────────
  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    if (!body || typeof body !== "object") throw new Error("Empty body");
  } catch {
    console.error("[Webhook] Failed to parse IPN body");
    return res.status(400).end();
  }

  // ── Verify IPN Signature ──────────────────────────────────────────────────
  const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;
  const sig       = req.headers["x-nowpayments-sig"];

  if (ipnSecret) {
    if (!sig) {
      console.warn("[Webhook] Missing x-nowpayments-sig header — rejecting");
      return res.status(401).end();
    }
    // Signature is HMAC-SHA512 of the JSON body with keys sorted alphabetically
    const sortedJson = JSON.stringify(
      Object.fromEntries(
        Object.entries(body).sort(([a], [b]) => a.localeCompare(b))
      )
    );
    const computed = crypto.createHmac("sha512", ipnSecret).update(sortedJson).digest("hex");
    if (computed !== sig) {
      console.warn("[Webhook] Signature mismatch — rejecting IPN");
      return res.status(401).end();
    }
  } else {
    // Log a warning but don't block — set the secret as soon as possible
    console.warn("[Webhook] NOWPAYMENTS_IPN_SECRET is not set — signature verification skipped");
  }

  // ── Destructure payload ───────────────────────────────────────────────────
  const {
    payment_status,
    order_id,
    payment_id,
    price_amount,
    price_currency,
    pay_currency,
    actually_paid,
    actually_paid_at_fiat,
    outcome_amount,
    outcome_currency,
    updated_at,
  } = body;

  console.info(
    `[Webhook] Payment update | order=${order_id} | payment=${payment_id} | status=${payment_status} | paid=${actually_paid} ${pay_currency}`
  );

  // ── Handle each status ────────────────────────────────────────────────────
  switch (payment_status) {

    case "confirmed":
    case "finished": {
      // ── PAYMENT COMPLETE — fulfil the order ──────────────────────────────
      //
      // TODO: integrate your fulfilment steps here once ready.
      //
      // Option A — Record in Supabase (Supabase client already in the project):
      //
      // import { createClient } from "@supabase/supabase-js";
      // const supabase = createClient(
      //   process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
      //   process.env.SUPABASE_SERVICE_ROLE_KEY
      // );
      // await supabase.from("orders").upsert({
      //   order_id,
      //   payment_id,
      //   status:   "paid",
      //   currency: pay_currency,
      //   paid_at:  updated_at ?? new Date().toISOString(),
      // });
      //
      // Option B — Send licence key email (e.g. via Resend, SendGrid, etc.):
      // await sendLicenceKeyEmail(order_id);
      //
      // Option C — Assign Discord role via bot API:
      // await assignDiscordRole(order_id);
      
      console.info(`[Webhook] ✅ Payment CONFIRMED for order ${order_id} | payment_id=${payment_id}`);
      break;
    }

    case "partially_paid": {
      // User sent less than required — follow NOWPayments dashboard settings
      // (they can configure auto-refund or ask user to top up)
      console.warn(
        `[Webhook] ⚠️  PARTIAL payment for order ${order_id} | paid=${actually_paid} ${pay_currency}`
      );
      break;
    }

    case "failed":
    case "expired": {
      // Payment window closed or transaction rejected
      console.warn(`[Webhook] ❌ Payment ${payment_status.toUpperCase()} for order ${order_id}`);
      break;
    }

    case "waiting":
    case "confirming":
    case "sending": {
      // Normal in-flight states — informational only
      console.info(`[Webhook] ⏳ Status "${payment_status}" for order ${order_id}`);
      break;
    }

    default:
      console.info(`[Webhook] Unhandled status "${payment_status}" for order ${order_id}`);
  }

  // ── Always ACK with 200 so NOWPayments stops retrying ────────────────────
  return res.status(200).json({ received: true });
}
