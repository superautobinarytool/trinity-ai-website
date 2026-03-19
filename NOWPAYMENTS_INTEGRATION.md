# NOWPayments.io Integration Guide

**Project:** Trinity AI Website  
**File:** `src/pages/Checkout.tsx`  
**Integration point:** `initiateNOWPayment()` function (line ~89 in Checkout.tsx)

---

## Overview

The checkout page is fully built and pre-wired for NOWPayments. The integration is stubbed behind a single async function. Once you complete the steps below, you uncomment ~10 lines of code and the full payment flow goes live.

**Flow summary:**
```
User fills form → clicks "Proceed to Secure Payment"
  → your backend creates a NOWPayments invoice
  → user is redirected to NOWPayments hosted checkout
  → user pays in crypto
  → NOWPayments calls your webhook
  → you fulfil the order (send licence key, create Discord role, etc.)
```

---

## Step 1 — Create a NOWPayments account

1. Go to [https://nowpayments.io](https://nowpayments.io) and sign up for a **business** account.
2. Complete KYB (Know Your Business) verification — required before you can receive payments.
3. Navigate to **Settings → API Keys** and generate a new API key. Keep it secret.
4. Add your website domain to the **Allowed Domains** whitelist in your dashboard.

---

## Step 2 — Connect a payout wallet

1. In the NOWPayments dashboard go to **Wallets** → Add wallet addresses for each coin you want to accept.
2. USDT (TRC-20 or ERC-20) and BTC are the recommended starting pair.
3. Optionally configure **Auto Convert** so all incoming crypto is auto-converted to your preferred stablecoin.

---

## Step 3 — Backend endpoint

You need one server-side endpoint that calls the NOWPayments API. This is mandatory — your API key must never be exposed in the browser.

### Node.js / Express example

```javascript
// POST /api/payments/create-invoice
import express from "express";
import fetch   from "node-fetch";

const router = express.Router();

router.post("/create-invoice", async (req, res) => {
  const { name, email, plan, coupon, amount, orderId } = req.body;

  // Basic input validation
  if (!email || !amount || !orderId || amount <= 0) {
    return res.status(400).json({ message: "Invalid order data" });
  }

  try {
    const response = await fetch("https://api.nowpayments.io/v1/invoice", {
      method:  "POST",
      headers: {
        "x-api-key":     process.env.NOWPAYMENTS_API_KEY,  // store in .env — never commit
        "Content-Type":  "application/json",
      },
      body: JSON.stringify({
        price_amount:      amount,               // USD amount after discount
        price_currency:    "usd",
        order_id:          orderId,              // your unique reference
        order_description: `Trinity ${plan} plan — ${email}`,
        ipn_callback_url:  process.env.NOWPAYMENTS_WEBHOOK_URL,  // see Step 5
        success_url:       `${process.env.SITE_URL}/thank-you?order=${orderId}`,
        cancel_url:        `${process.env.SITE_URL}/checkout?plan=${plan}`,
        // Optional: customise which coins are offered
        // pay_currency: "btc",
      }),
    });

    if (!response.ok) {
      const body = await response.json();
      console.error("[NOWPayments] invoice creation failed:", body);
      return res.status(502).json({ message: "Payment gateway error. Please try again." });
    }

    const invoice = await response.json();
    // invoice.invoice_url → the hosted checkout page on nowpayments.io

    // Persist the pending order to your database here if needed:
    // await db.orders.create({ orderId, email, name, plan, amount, coupon, status: "pending" });

    return res.json({ invoice_url: invoice.invoice_url });

  } catch (err) {
    console.error("[NOWPayments] unexpected error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
```

### Required environment variables

```env
NOWPAYMENTS_API_KEY=your_live_api_key_here
NOWPAYMENTS_WEBHOOK_URL=https://yourdomain.com/api/payments/webhook
NOWPAYMENTS_IPN_SECRET=your_ipn_secret_from_dashboard
SITE_URL=https://yourdomain.com
```

---

## Step 4 — Activate the frontend

Open `src/pages/Checkout.tsx` and find the `initiateNOWPayment` function (~line 89).

**Uncomment** the fetch block:

```typescript
async function initiateNOWPayment(order: OrderPayload): Promise<string> {
  const res = await fetch("/api/payments/create-invoice", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(order),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "Payment gateway error. Please try again.");
  }

  const { invoice_url } = await res.json();
  return invoice_url;
}
```

**Delete** the stub `throw new Error("NOWPAYMENTS_NOT_CONFIGURED")` line below it.

---

## Step 5 — Webhook (IPN) handler

NOWPayments sends a POST to your `ipn_callback_url` whenever a payment status changes.

```javascript
// POST /api/payments/webhook
import crypto from "crypto";

router.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const sig       = req.headers["x-nowpayments-sig"];
  const secret    = process.env.NOWPAYMENTS_IPN_SECRET;
  const payload   = req.body; // raw Buffer

  // Verify signature
  const hmac = crypto.createHmac("sha512", secret);
  hmac.update(JSON.stringify(JSON.parse(payload.toString()), Object.keys(JSON.parse(payload.toString())).sort()));
  const computed = hmac.digest("hex");

  if (computed !== sig) {
    console.warn("[Webhook] Invalid signature — rejecting");
    return res.status(401).send("Unauthorized");
  }

  const data = JSON.parse(payload.toString());
  const { payment_status, order_id, price_amount, price_currency } = data;

  switch (payment_status) {
    case "confirmed":
    case "finished":
      // ✅ Payment complete — fulfil the order:
      // - Send licence key email
      // - Assign Discord role
      // - Store subscription record in Supabase
      // await fulfillOrder(order_id);
      break;

    case "failed":
    case "expired":
      // ❌ Payment failed — notify user, mark order failed
      // await markOrderFailed(order_id);
      break;

    case "partially_paid":
      // ⚠️  User underpaid — decide how to handle
      break;

    default:
      // "waiting", "confirming", "sending" — intermediate states, just log
      console.info(`[Webhook] Payment ${order_id} status: ${payment_status}`);
  }

  // Always ACK with 200 otherwise NOWPayments will retry
  return res.sendStatus(200);
});
```

### IPN secret setup

1. NOWPayments dashboard → **Settings → Instant Payment Notifications**
2. Enter your webhook URL
3. Copy the **IPN Secret Key** → set as `NOWPAYMENTS_IPN_SECRET` env var

---

## Step 6 — Sandbox testing

Before going live, test with the **NOWPayments Sandbox**:

1. Create a sandbox account at [https://sandbox.nowpayments.io](https://sandbox.nowpayments.io)
2. Use the sandbox API key (replace in `.env` for local testing)
3. Change the API base URL to `https://api.sandbox.nowpayments.io/v1/invoice` in your backend
4. NOWPayments provides a sandbox payment simulator — confirm payments without real crypto

---

## Step 7 — Go-live checklist

- [ ] KYB verification approved in NOWPayments dashboard
- [ ] Live API key added to production environment variables
- [ ] Webhook URL publicly accessible (not localhost)
- [ ] IPN signature verification enabled and tested
- [ ] `initiateNOWPayment` fetch block uncommented in `Checkout.tsx`
- [ ] `NOWPAYMENTS_NOT_CONFIGURED` stub throw deleted
- [ ] Test end-to-end purchase in sandbox with all 3 coupon codes
- [ ] Order fulfilment logic connected (email sender, licence key store)
- [ ] Error paths tested: declined card, expired invoice, partial payment
- [ ] `SITE_URL` env var set to production domain

---

## Accepted cryptocurrency reference

NOWPayments supports 150+ coins. The checkout UI currently displays:

| Symbol | Name       |
|--------|------------|
| BTC    | Bitcoin    |
| ETH    | Ethereum   |
| USDT   | Tether     |
| USDC   | USD Coin   |
| BNB    | BNB        |
| LTC    | Litecoin   |

To restrict which coins are offered, pass `pay_currency` in the invoice creation request. To show all supported coins, omit it (user selects on the NOWPayments page).

---

## Coupon codes (current dummy set)

These are validated **client-side only** right now. Before going live, move validation to the backend so codes can't be inspected in the browser bundle.

| Code       | Discount                |
|------------|-------------------------|
| `TRINITY20`| 20% off first month     |
| `LAUNCH10` | 10% off first month     |
| `WELCOME5` | $5.00 off first month   |

To add more codes, update the `VALID_COUPONS` object in `src/pages/Checkout.tsx`.

---

## Order payload shape

The object sent from the frontend to your backend:

```typescript
interface OrderPayload {
  name:    string;        // customer full name
  email:   string;        // customer email (lowercase, trimmed)
  plan:    "starter" | "pro";
  coupon:  string | null; // applied coupon code, or null
  amount:  number;        // final USD amount after discount (e.g. 43.51)
  orderId: string;        // unique reference e.g. "TRINITY-1718910000000-AB12CD34"
}
```

---

## Support

- NOWPayments docs: [https://documenter.getpostman.com/view/7907941/2s93JxqLQy](https://documenter.getpostman.com/view/7907941/2s93JxqLQy)
- NOWPayments support: support@nowpayments.io
- Trinity Discord: https://discord.gg/titansalgo
