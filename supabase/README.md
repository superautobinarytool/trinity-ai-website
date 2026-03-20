# Supabase Integration — Project Trinity

## Project Info

| Property | Value |
|---|---|
| **Domain** | `trinitytradingai.com` |
| **Supabase Project ID** | `pozwzuinjkgdyyyqbohz` |
| **Supabase URL** | `https://pozwzuinjkgdyyyqbohz.supabase.co` |
| **Supabase Dashboard** | [https://supabase.com/dashboard/project/pozwzuinjkgdyyyqbohz](https://supabase.com/dashboard/project/pozwzuinjkgdyyyqbohz) |
| **SQL Editor** | [https://supabase.com/dashboard/project/pozwzuinjkgdyyyqbohz/sql/new](https://supabase.com/dashboard/project/pozwzuinjkgdyyyqbohz/sql/new) |
| **Payment Gateway** | NOWPayments (sandbox key active — swap for live when ready) |
| **Email Provider** | Resend (`re_Mwy525bw_...` — key is set in `.env.local`) |

---

## Environment Setup

All secrets live in `.env.local` (gitignored — never committed).

```bash
# Windows PowerShell — create your local secrets file
Copy-Item .env.example .env.local
```

### Current `.env.local` status

| Variable | Status | Notes |
|---|---|---|
| `VITE_SUPABASE_URL` | ✅ Set | `https://pozwzuinjkgdyyyqbohz.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | ✅ Set | Safe to expose in browser (locked to RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Set | Server-side only — bypasses RLS |
| `NOWPAYMENTS_API_KEY` | ✅ Set | **Sandbox key** — swap for live key before launch |
| `NOWPAYMENTS_SANDBOX` | ✅ `true` | Change to `false` when going live |
| `NOWPAYMENTS_IPN_SECRET` | ✅ Set | Configure matching URL in NOWPayments dashboard |
| `RESEND_API_KEY` | ✅ Set | Free tier: 100 emails/day, 3,000/month |
| `EMAIL_FROM` | ✅ Set | `noreply@trinitytradingai.com` |
| `EMAIL_REPLY_TO` | ✅ Set | `support@trinitytradingai.com` |
| `APP_URL` | ✅ Set | `https://trinitytradingai.com` |

---

## Database Tables

### `licenses` — Issued software licenses *(pre-existing)*
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK, auto-generated |
| `customer_name` | `text` | NOT NULL |
| `email` | `text` | NOT NULL |
| `license_key` | `text` | Format: `TRIN-XXXX-XXXX-XXXX` |
| `start_date` | `timestamptz` | DEFAULT `now()` |
| `expiry_date` | `timestamptz` | 30 days after payment confirmed |
| `is_active` | `boolean` | DEFAULT `true` |
| `created_at` | `timestamptz` | AUTO |
| `updated_at` | `timestamptz` | AUTO |

### `coupons` — Discount coupon codes *(migration 001)*
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK, auto-generated |
| `code` | `text` | Unique, e.g. `SAVE20` |
| `discount_percent` | `numeric(5,2)` | 0.01–100.00 |
| `is_active` | `boolean` | Toggle without deleting |
| `max_uses` | `integer` | NULL = unlimited |
| `times_used` | `integer` | Auto-incremented on use |
| `expires_at` | `timestamptz` | NULL = never expires |
| `created_at` | `timestamptz` | AUTO |
| `updated_at` | `timestamptz` | AUTO |

### `orders` — Payment lifecycle tracking *(migration 002)*
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK, auto-generated |
| `order_id` | `text` | Unique client ref e.g. `TRINITY-1718910000000-AB12CD` |
| `customer_name` | `text` | NOT NULL |
| `email` | `text` | NOT NULL |
| `plan` | `text` | `starter` or `pro` |
| `amount_usd` | `numeric(10,2)` | Server-calculated after coupon |
| `coupon_code` | `text` | NULL if none applied |
| `status` | `text` | `pending` → `confirmed` / `failed` / `expired` |
| `nowpayments_payment_id` | `text` | Set by the IPN webhook |
| `license_id` | `uuid` | FK → `licenses.id`, set once payment confirmed |
| `created_at` | `timestamptz` | AUTO |
| `updated_at` | `timestamptz` | AUTO |

---

## Migrations

Run in the [Supabase SQL Editor](https://supabase.com/dashboard/project/pozwzuinjkgdyyyqbohz/sql/new) in order.
All use `CREATE TABLE IF NOT EXISTS` — safe to re-run without side effects.

| # | File | Description | Run? |
|---|------|-------------|------|
| 001 | `migrations/001_create_coupons.sql` | Coupon codes + discount percentages | ⬜ Pending |
| 002 | `migrations/002_create_orders.sql` | Payment order lifecycle tracking | ⬜ Pending |

---

## Automated Payment → License Flow

```
Customer submits checkout form
          ↓
POST /api/payments/create-invoice
  • Server recalculates price from DB (never trusts client-sent amount)
  • Validates coupon against coupons table, increments times_used
  • Writes orders row (status = "pending")
  • Calls NOWPayments API → returns hosted invoice_url
          ↓
Customer redirected to NOWPayments hosted crypto payment page
          ↓
Customer pays in crypto (BTC, ETH, USDT, USDC, BNB, LTC, etc.)
          ↓
POST /api/payments/webhook  (NOWPayments IPN callback)
  • Verifies HMAC-SHA512 signature with IPN secret (timing-safe)
  • Idempotency check — will never issue duplicate licenses
  • Generates cryptographically random license key (TRIN-XXXX-XXXX-XXXX)
  • Inserts row into licenses table
  • Updates orders row (status = "confirmed", license_id = FK)
  • Sends branded HTML email to customer via Resend
          ↓
Customer lands on /thank-you page with their order reference
          ↓
Customer receives email with license key + activation instructions
```

---

## Serverless API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/payments/create-invoice` | `POST` | Creates NOWPayments invoice, records pending order |
| `/api/payments/webhook` | `POST` | NOWPayments IPN receiver — issues license + sends email |

Source files: `api/payments/create-invoice.ts` and `api/payments/webhook.ts`

Vercel automatically deploys every file in `api/` as a serverless function. The routing is already configured in `vercel.json`.

---

## Folder Structure

```
project-trinity/
├── .env.example                         ← Safe credential template (committed)
├── .env.local                           ← Real secrets (gitignored — never commit)
├── vercel.json                          ← Routing: /api/* + SPA fallback
│
├── api/                                 ← Vercel serverless functions (Node.js)
│   ├── tsconfig.json
│   ├── lib/
│   │   ├── supabase-admin.ts            ← Service-role DB client (server-only)
│   │   ├── license-key.ts               ← Crypto-random TRIN-XXXX-XXXX-XXXX generator
│   │   └── email.ts                     ← Resend client + branded HTML email template
│   └── payments/
│       ├── create-invoice.ts            ← POST /api/payments/create-invoice
│       └── webhook.ts                   ← POST /api/payments/webhook
│
├── supabase/
│   ├── client.ts                        ← Singleton Supabase client (browser-safe)
│   ├── README.md                        ← This file
│   ├── schema/
│   │   ├── database.types.ts            ← TypeScript types for all 3 tables
│   │   ├── licenses.sql                 ← Snapshot dump: licenses table + 1 test row
│   │   └── coupons.sql                  ← Snapshot dump: coupons table
│   └── migrations/
│       ├── 001_create_coupons.sql       ← ⬜ Run in Supabase SQL Editor
│       └── 002_create_orders.sql        ← ⬜ Run in Supabase SQL Editor
│
└── src/
    ├── lib/supabase.ts                  ← App-facing re-export (use this in components)
    └── pages/
        ├── Checkout.tsx                 ← Calls /api/payments/create-invoice on submit
        └── ThankYou.tsx                 ← Shown after redirect from NOWPayments
```

---

## Pre-Launch Checklist

### Database
- [ ] Run `migrations/001_create_coupons.sql` in Supabase SQL Editor
- [ ] Run `migrations/002_create_orders.sql` in Supabase SQL Editor

### Email (Resend)
- [ ] Add `trinitytradingai.com` as a verified domain in [Resend Dashboard → Domains](https://resend.com/domains)
- [ ] Add the DNS records Resend provides to your domain registrar
- [ ] Wait for Resend to show domain as **Verified**

### NOWPayments
- [ ] Set IPN Callback URL to `https://trinitytradingai.com/api/payments/webhook` in NOWPayments dashboard
- [ ] IPN Secret already set in `.env.local` (`NOWPAYMENTS_IPN_SECRET`)
- [ ] When ready for live payments: replace sandbox API key with live key and set `NOWPAYMENTS_SANDBOX=false`

### Vercel Deployment
- [ ] Add all `.env.local` variables to Vercel → Project → Settings → Environment Variables
- [ ] Redeploy so serverless functions pick up the new environment variables
- [ ] Test full checkout flow end-to-end in sandbox mode

---

## Security Notes

- `.env.local` is gitignored — **never** commit it
- `VITE_SUPABASE_ANON_KEY` is safe in the browser — locked to RLS policies
- `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS — only used inside `api/lib/supabase-admin.ts`, never in browser code, never prefixed with `VITE_`
- `RESEND_API_KEY`, `NOWPAYMENTS_API_KEY`, `NOWPAYMENTS_IPN_SECRET` are server-side only — same rule
- IPN webhook uses HMAC-SHA512 signature verification with timing-safe comparison to prevent forgery
- License key generation uses `crypto.randomBytes` (cryptographically secure) with bias rejection

---

## Regenerating TypeScript Types

If you add new columns or tables, regenerate `database.types.ts`:

```bash
npx supabase gen types typescript \
  --project-id pozwzuinjkgdyyyqbohz \
  --schema public \
  > supabase/schema/database.types.ts
```
