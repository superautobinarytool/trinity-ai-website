-- ═══════════════════════════════════════════════════════════════════════════
-- Project Trinity — Migration
-- File    : 003_add_annual_plan_support.sql
-- Created : 2026-03-20
-- Purpose : Extend orders + licenses tables to support annual plans.
--           • orders.plan constraint extended to include 'starter-annual' / 'pro-annual'
--           • licenses gains two columns: plan (which plan was purchased)
--                                          billing_type ('monthly' | 'annual')
-- Safe to re-run — uses IF NOT EXISTS / DROP IF EXISTS guards throughout.
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── 1. Extend orders.plan to include annual plan types ──────────────────────
ALTER TABLE public."orders"
  DROP CONSTRAINT IF EXISTS "orders_plan_check";

ALTER TABLE public."orders"
  ADD CONSTRAINT "orders_plan_check"
    CHECK (plan IN ('starter', 'pro', 'starter-annual', 'pro-annual'));

-- ─── 2. Add plan column to licenses ──────────────────────────────────────────
ALTER TABLE public."licenses"
  ADD COLUMN IF NOT EXISTS "plan" text NOT NULL DEFAULT 'starter';

ALTER TABLE public."licenses"
  DROP CONSTRAINT IF EXISTS "licenses_plan_check";

ALTER TABLE public."licenses"
  ADD CONSTRAINT "licenses_plan_check"
    CHECK (plan IN ('starter', 'pro', 'starter-annual', 'pro-annual'));

-- ─── 3. Add billing_type column to licenses ───────────────────────────────────
ALTER TABLE public."licenses"
  ADD COLUMN IF NOT EXISTS "billing_type" text NOT NULL DEFAULT 'monthly';

ALTER TABLE public."licenses"
  DROP CONSTRAINT IF EXISTS "licenses_billing_type_check";

ALTER TABLE public."licenses"
  ADD CONSTRAINT "licenses_billing_type_check"
    CHECK (billing_type IN ('monthly', 'annual'));

-- ─── Column comments ─────────────────────────────────────────────────────────
COMMENT ON COLUMN public."licenses"."plan"
  IS 'Plan purchased: starter | pro | starter-annual | pro-annual';

COMMENT ON COLUMN public."licenses"."billing_type"
  IS 'Billing cycle: monthly = 30-day, annual = 365-day';

-- ─── End of migration ────────────────────────────────────────────────────────
