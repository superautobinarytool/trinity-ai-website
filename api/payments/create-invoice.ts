import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSupabaseAdmin } from "../lib/supabase-admin";

/* ─── Plan catalogue (single source of truth server-side) ───────────────────
   Mirror any price changes here AND in the frontend PLANS constant.          */
const PLAN_PRICES: Record<string, number> = {
  starter:          99,
  pro:             199,
  "starter-annual": 599,
  "pro-annual":     899,
};

const NOWPAYMENTS_BASE = process.env.NOWPAYMENTS_SANDBOX === "true"
  ? "https://api-sandbox.nowpayments.io/v1"
  : "https://api.nowpayments.io/v1";

/* ─── Handler ────────────────────────────────────────────────────────────── */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  // ── 1. Parse & validate request body ─────────────────────────────────────
  const { name, email, plan, coupon, orderId } = req.body ?? {};

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    res.status(400).json({ message: "A valid name is required." });
    return;
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ message: "A valid email address is required." });
    return;
  }
  if (!plan || !PLAN_PRICES[plan]) {
    res.status(400).json({ message: "Invalid plan selected." });
    return;
  }
  if (!orderId || typeof orderId !== "string") {
    res.status(400).json({ message: "Missing order ID." });
    return;
  }

  // ── 2. Server-side price calculation (never trust client amount) ──────────
  let amount = PLAN_PRICES[plan];
  let appliedCouponCode: string | null = null;

  if (coupon && typeof coupon === "string") {
    const code = coupon.trim().toUpperCase();

    const { data: couponRow } = await getSupabaseAdmin()
      .from("coupons")
      .select("id, discount_percent, is_active, max_uses, times_used, expires_at")
      .eq("code", code)
      .maybeSingle();

    if (couponRow && couponRow.is_active) {
      // Check expiry
      const expired = couponRow.expires_at
        ? new Date(couponRow.expires_at) < new Date()
        : false;

      // Check usage cap
      const maxedOut = couponRow.max_uses !== null
        ? couponRow.times_used >= couponRow.max_uses
        : false;

      if (!expired && !maxedOut) {
        const discount = parseFloat(
          ((amount * Number(couponRow.discount_percent)) / 100).toFixed(2)
        );
        amount = parseFloat(Math.max(0, amount - discount).toFixed(2));
        appliedCouponCode = code;

        // Increment usage counter (non-blocking — fire and forget)
        getSupabaseAdmin()
          .from("coupons")
          .update({ times_used: couponRow.times_used + 1 })
          .eq("id", couponRow.id)
          .then(() => void 0);
      }
    }
  }

  // ── 3. Persist a pending order (idempotency guard) ────────────────────────
  const { error: orderError } = await getSupabaseAdmin().from("orders").insert({
    order_id:     orderId,
    customer_name: name.trim(),
    email:        email.trim().toLowerCase(),
    plan,
    amount_usd:   amount,
    coupon_code:  appliedCouponCode,
    status:       "pending",
  });

  if (orderError) {
    // Duplicate order_id = this is a retry; that's fine, proceed
    if (!orderError.message.includes("duplicate") && !orderError.code?.includes("23505")) {
      console.error("[create-invoice] DB insert error:", orderError);
      res.status(500).json({ message: "Failed to record order. Please try again." });
      return;
    }
  }

  // ── 4. Create NOWPayments invoice ─────────────────────────────────────────
  const appUrl = (process.env.APP_URL ?? "").replace(/\/$/, "");
  const isAnnual   = (plan as string).endsWith("-annual");
  const baseName   = (plan as string).replace("-annual", "");
  const planLabel  = baseName.charAt(0).toUpperCase() + baseName.slice(1);
  const periodDesc = isAnnual ? "1 Year" : "1 Month";

  const npBody = {
    price_amount:      amount,
    price_currency:    "usd",
    order_id:          orderId,
    order_description: `Trinity ${planLabel} License — ${periodDesc}`,
    success_url:       `${appUrl}/thank-you?order=${orderId}&plan=${plan}`,
    cancel_url:        `${appUrl}/payment-cancelled?plan=${plan}`,
    ipn_callback_url:  `${appUrl}/api/payments/webhook`,
  };

  const npRes = await fetch(`${NOWPAYMENTS_BASE}/invoice`, {
    method:  "POST",
    headers: {
      "x-api-key":    process.env.NOWPAYMENTS_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(npBody),
  });

  const npData = await npRes.json().catch(() => ({})) as Record<string, unknown>;

  if (!npRes.ok) {
    console.error("[create-invoice] NOWPayments error:", npData);
    res.status(502).json({
      message: "Payment gateway error. Please try again or contact support.",
    });
    return;
  }

  const invoice_url = npData.invoice_url as string | undefined;
  if (!invoice_url) {
    res.status(502).json({ message: "No payment URL returned. Please try again." });
    return;
  }

  res.status(200).json({ invoice_url });
}
