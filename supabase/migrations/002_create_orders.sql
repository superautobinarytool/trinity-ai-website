-- ═══════════════════════════════════════════════════════════════════════════
-- Project Trinity — Migration
-- File    : 002_create_orders.sql
-- Created : 2026-03-20
-- Purpose : Create orders table to track payment lifecycle.
--           orders.license_id FK → licenses.id once payment confirms.
--           ZERO changes to the licenses or coupons tables.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public."orders" (
  "id"                      uuid                     DEFAULT gen_random_uuid() NOT NULL,

  -- The client-generated order reference (e.g. TRINITY-1718910000000-AB12CD)
  "order_id"                text                                               NOT NULL,

  "customer_name"           text                                               NOT NULL,
  "email"                   text                                               NOT NULL,

  -- 'starter' | 'pro'
  "plan"                    text                                               NOT NULL,

  -- USD amount charged after any coupon discount
  "amount_usd"              numeric(10, 2)                                     NOT NULL,

  -- Coupon code applied at checkout (NULL = none)
  "coupon_code"             text                     DEFAULT NULL,

  -- Payment lifecycle: pending → confirmed | failed | expired
  "status"                  text                     DEFAULT 'pending'         NOT NULL,

  -- NOWPayments payment_id returned in the IPN webhook
  "nowpayments_payment_id"  text                     DEFAULT NULL,

  -- Set once the license row is created
  "license_id"              uuid                     DEFAULT NULL,

  "created_at"              timestamp with time zone DEFAULT now()             NOT NULL,
  "updated_at"              timestamp with time zone DEFAULT now()             NOT NULL,

  CONSTRAINT "orders_pkey"
    PRIMARY KEY ("id"),
  CONSTRAINT "orders_order_id_unique"
    UNIQUE ("order_id"),
  CONSTRAINT "orders_status_check"
    CHECK (status IN ('pending', 'confirmed', 'failed', 'expired')),
  CONSTRAINT "orders_plan_check"
    CHECK (plan IN ('starter', 'pro')),
  CONSTRAINT "orders_amount_positive"
    CHECK (amount_usd > 0)
);

-- ─── Index for fast webhook lookups by order_id ───────────────────────────────
CREATE INDEX IF NOT EXISTS "orders_order_id_idx" ON public."orders" ("order_id");

-- ─── Index for admin views by email ──────────────────────────────────────────
CREATE INDEX IF NOT EXISTS "orders_email_idx"    ON public."orders" ("email");

-- ─── Column comments ─────────────────────────────────────────────────────────
COMMENT ON TABLE  public."orders"                           IS 'Payment orders — one row per checkout attempt';
COMMENT ON COLUMN public."orders"."order_id"               IS 'Client-generated idempotency key (TRINITY-timestamp-random)';
COMMENT ON COLUMN public."orders"."status"                  IS 'pending = awaiting payment; confirmed = license issued; failed/expired = no license';
COMMENT ON COLUMN public."orders"."nowpayments_payment_id" IS 'Payment ID returned by NOWPayments IPN';
COMMENT ON COLUMN public."orders"."license_id"             IS 'FK to public.licenses.id — populated once payment is confirmed';

-- ─── End of migration ────────────────────────────────────────────────────────
