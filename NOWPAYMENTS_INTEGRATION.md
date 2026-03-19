# NOWPayments.io Integration — Status & Reference

**Project:** Trinity AI Website  
**Status:** ✅ LIVE — crypto payments active | ⏳ Card / bank transfer activating soon

---

## Current state

| Component | Status |
|-----------|--------|
| Vercel serverless function (`api/payments/create-invoice.js`) | ✅ Deployed |
| Webhook handler (`api/payments/webhook.js`) | ✅ Deployed |
| Checkout page (`src/pages/Checkout.tsx`) | ✅ Live |
| Thank-you page (`src/pages/ThankYou.tsx`) | ✅ Live |
| Crypto payments | ✅ Active |
| Card / bank transfer (fiat) | ⏳ Being activated by NOWPayments — no code change needed |

When fiat is enabled in your NOWPayments account the checkout will offer both methods automatically — nothing to change in the codebase.

---

## Architecture

```
Browser (Checkout.tsx)
  │  POST /api/payments/create-invoice  { name, email, plan, coupon, amount, orderId }
  ▼
Vercel Serverless Function (api/payments/create-invoice.js)
  │  POST https://api.nowpayments.io/v1/invoice  (API key server-side only)
  ▼
NOWPayments API
  │  Returns { invoice_url }
  ▼
Browser redirected to NOWPayments hosted page
  │  User pays in chosen crypto
  ▼
NOWPayments IPN webhook → POST /api/payments/webhook
  │  Signature verified → status handled
  ▼
Fulfilment (TODO: send licence key email, Discord role, Supabase record)
  │
  ▼
NOWPayments redirects user → /thank-you?order=TRINITY-...&plan=starter
```

---

## Environment variables

### Local development (`.env.local` — not committed)

```env
NOWPAYMENTS_API_KEY=CSMH12B-7DKM4RJ-PEE7A7S-68ZG904

# Add once configured in NOWPayments dashboard:
# NOWPAYMENTS_IPN_SECRET=your-ipn-secret-here
```

### Vercel production (must be added in Vercel dashboard)

Go to **Vercel → Project → Settings → Environment Variables** and add:

| Variable | Value | Notes |
|----------|-------|-------|
| `NOWPAYMENTS_API_KEY` | `CSMH12B-7DKM4RJ-PEE7A7S-68ZG904` | Required — payment creation will fail without this |
| `NOWPAYMENTS_IPN_SECRET` | *(from NOWPayments dashboard)* | Strongly recommended for webhook security |

> **Important:** You shared the API key in chat. While it is stored server-side only and never sent to the browser, consider rotating it in your NOWPayments dashboard if you have any security concerns. New keys are generated at: Dashboard → Store Settings → API Keys.

---

## Step 1 — Add env vars to Vercel (required to go live)

The API key is already in `.env.local` for local testing. For production:

1. Go to [https://vercel.com](https://vercel.com) → your project → **Settings → Environment Variables**
2. Add `NOWPAYMENTS_API_KEY` = `CSMH12B-7DKM4RJ-PEE7A7S-68ZG904`
3. Set scope to **Production** (and Preview if you want test deploys to work too)
4. Redeploy (or it takes effect on next push)

---

## Step 2 — Configure the IPN webhook

1. Log in to NOWPayments dashboard → **Store Settings → Instant Payment Notifications**
2. Set callback URL to: `https://your-vercel-domain.vercel.app/api/payments/webhook`
3. Copy the generated **IPN Secret Key**
4. Add it as `NOWPAYMENTS_IPN_SECRET` in Vercel environment variables

Until this is set, the webhook will process events but skip signature verification (logged as a warning). Set it as soon as possible.

---

## Step 3 — Connect payout wallets

If not already done:

1. NOWPayments dashboard → **Wallets**
2. Add addresses for BTC, ETH, USDT (TRC-20 recommended), USDC, BNB, LTC
3. Optionally enable **Auto Convert** to consolidate into your preferred stablecoin

---

## Step 4 — Wire up order fulfilment

When a payment completes, NOWPayments fires a webhook with `payment_status: "finished"`.  
Open `api/payments/webhook.js` and add your fulfilment logic inside the `"finished"` case:

```javascript
case "confirmed":
case "finished": {
  // Option A — Supabase (client already in the project):
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  await supabase.from("orders").upsert({
    order_id, payment_id, status: "paid",
    currency: pay_currency, paid_at: updated_at ?? new Date().toISOString(),
  });

  // Option B — Send licence key email (Resend, SendGrid, etc.)
  // await sendLicenceKeyEmail({ order_id, email: ... });

  // Option C — Assign Discord role
  // await assignDiscordRole(order_id);
  break;
}
```

---

## Testing payments

### Sandbox (recommended before going live)

1. Create a sandbox account at [https://sandbox.nowpayments.io](https://sandbox.nowpayments.io)
2. Replace `NOWPAYMENTS_API_KEY` in `.env.local` with the sandbox API key
3. In `api/payments/create-invoice.js`, change the URL to:  
   `https://api.sandbox.nowpayments.io/v1/invoice`
4. Use the built-in payment simulator on the NOWPayments sandbox UI to confirm payments

Revert both changes when done testing.

### Quick smoke test (production)

1. Go to `/checkout?plan=starter`
2. Fill in a name + email, click "Proceed to Secure Payment"
3. Verify you are redirected to a NOWPayments-hosted invoice page
4. Check Vercel function logs: **Vercel dashboard → Functions → create-invoice** to confirm the call succeeded

---

## Coupon codes

Validated client-side (Checkout.tsx). Move to server-side validation after go-live to prevent bundle inspection.

| Code | Discount |
|------|---------|
| `TRINITY20` | 20% off first month |
| `LAUNCH10` | 10% off first month |
| `WELCOME5` | $5.00 off |

To add codes: update `VALID_COUPONS` in `src/pages/Checkout.tsx`.

---

## Fiat / card payments

When NOWPayments activates the fiat feature on your account:
- The NOWPayments hosted checkout page will show card/bank options automatically
- No code changes are needed
- Remove the "Card payments coming soon" note from `src/pages/Checkout.tsx` once active:
  Find the `{/* Fiat coming soon strip */}` comment block and delete those ~7 lines.

---

## Order payload reference

```typescript
interface OrderPayload {
  name:    string;        // customer full name (trimmed)
  email:   string;        // customer email (lowercase, trimmed)
  plan:    "starter" | "pro";
  coupon:  string | null; // applied coupon code, or null
  amount:  number;        // USD amount after discount, e.g. 43.51
  orderId: string;        // "TRINITY-{timestamp}-{random}" e.g. TRINITY-1718910000000-AB12CD
}
```

---

## File reference

| File | Purpose |
|------|---------|
| `api/payments/create-invoice.js` | Vercel serverless function — proxies invoice creation to NOWPayments |
| `api/payments/webhook.js` | IPN handler — receives and verifies payment status updates |
| `src/pages/Checkout.tsx` | Checkout form — calls `/api/payments/create-invoice` on submit |
| `src/pages/ThankYou.tsx` | Post-payment confirmation page |
| `.env.local` | Local env vars (gitignored) |
| `.env.example` | Template for collaborators |

---

## Support

- NOWPayments API docs: https://documenter.getpostman.com/view/7907941/2s93JxqLQy
- NOWPayments support: support@nowpayments.io
- Trinity Discord: https://discord.gg/titansalgo
