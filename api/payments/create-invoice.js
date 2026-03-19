/**
 * POST /api/payments/create-invoice
 *
 * Receives an order payload from the checkout form, validates it, and calls
 * the NOWPayments Invoices API to create a hosted payment page. Returns the
 * invoice_url which the frontend redirects the user to.
 *
 * The API key lives server-side only — never exposed to the browser bundle.
 */

export default async function handler(req, res) {
  // ── CORS (same-origin on Vercel, but explicit for local dev) ─────────────
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // ── Parse & destructure body ──────────────────────────────────────────────
  const body = req.body ?? {};
  const { name, email, plan, coupon, amount, orderId } = body;

  // ── Input validation ──────────────────────────────────────────────────────
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({ message: "Invalid name provided." });
  }
  if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ message: "Invalid email address." });
  }
  if (!["starter", "pro"].includes(plan)) {
    return res.status(400).json({ message: "Invalid plan selected." });
  }
  if (typeof amount !== "number" || amount <= 0 || amount > 300) {
    return res.status(400).json({ message: "Invalid order amount." });
  }
  if (!orderId || typeof orderId !== "string" || !/^TRINITY-\d{13}-[A-Z0-9]{4,9}$/.test(orderId)) {
    return res.status(400).json({ message: "Invalid order reference." });
  }

  // ── API key guard ─────────────────────────────────────────────────────────
  const apiKey = process.env.NOWPAYMENTS_API_KEY;
  if (!apiKey) {
    console.error("[NOWPayments] NOWPAYMENTS_API_KEY environment variable is not set");
    return res.status(503).json({
      message: "Payment gateway is temporarily unavailable. Please contact support.",
    });
  }

  // ── Build URLs dynamically so staging / production work without config ────
  const host  = req.headers["x-forwarded-host"] || req.headers.host || "localhost:5173";
  const proto = host.startsWith("localhost") ? "http" : "https";
  const base  = `${proto}://${host}`;

  const planLabel  = plan === "pro" ? "Pro" : "Starter";
  const couponNote = coupon ? ` | Code: ${coupon}` : "";
  const webhookUrl = process.env.NOWPAYMENTS_WEBHOOK_URL || `${base}/api/payments/webhook`;

  // ── Call NOWPayments Invoices API ─────────────────────────────────────────
  let response;
  try {
    response = await fetch("https://api.nowpayments.io/v1/invoice", {
      method:  "POST",
      headers: {
        "x-api-key":    apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price_amount:      amount,
        price_currency:    "usd",
        order_id:          orderId,
        order_description: `Trinity ${planLabel} Plan${couponNote}`,
        ipn_callback_url:  webhookUrl,
        success_url:       `${base}/thank-you?order=${encodeURIComponent(orderId)}&plan=${plan}`,
        cancel_url:        `${base}/checkout?plan=${plan}`,
        is_fee_paid_by_user: false,
        // pay_currency: uncomment to pre-select a coin
        // case_sensitive: false,
      }),
    });
  } catch (networkErr) {
    console.error("[NOWPayments] Network error calling Invoices API:", networkErr);
    return res.status(502).json({ message: "Could not reach the payment gateway. Please try again." });
  }

  // ── Handle NOWPayments error responses ───────────────────────────────────
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error(`[NOWPayments] Invoice creation failed (${response.status}):`, errorData);
    const msg =
      errorData?.message ||
      "The payment gateway returned an error. Please try again or contact support.";
    return res.status(502).json({ message: msg });
  }

  // ── Success: return invoice URL to frontend ───────────────────────────────
  const invoice = await response.json();
  console.info(
    `[NOWPayments] Invoice created | id=${invoice.id} | order=${orderId} | amount=$${amount} | plan=${plan}`
  );

  return res.status(200).json({ invoice_url: invoice.invoice_url });
}
