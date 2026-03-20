-- ═══════════════════════════════════════════════════════════════════════════
-- Project Trinity — Migration
-- File    : 001_create_coupons.sql
-- Created : 2026-03-20
-- Purpose : Create the coupons table (standalone — no changes to licenses)
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── Safety guard: do nothing if coupons already exists ──────────────────────
-- Using CREATE TABLE IF NOT EXISTS means this is 100% re-runnable and will
-- never touch the existing licenses table.

CREATE TABLE IF NOT EXISTS public."coupons" (
  "id"                uuid                     DEFAULT gen_random_uuid()  NOT NULL,
  "code"              text                                                  NOT NULL,
  "discount_percent"  numeric(5, 2)                                         NOT NULL,
  "is_active"         boolean                  DEFAULT true                NOT NULL,
  "max_uses"          integer                  DEFAULT NULL,
  "times_used"        integer                  DEFAULT 0                   NOT NULL,
  "expires_at"        timestamp with time zone DEFAULT NULL,
  "created_at"        timestamp with time zone DEFAULT now()               NOT NULL,
  "updated_at"        timestamp with time zone DEFAULT now()               NOT NULL,

  CONSTRAINT "coupons_pkey"                    PRIMARY KEY ("id"),
  CONSTRAINT "coupons_code_unique"             UNIQUE ("code"),
  CONSTRAINT "coupons_discount_range"
    CHECK (discount_percent > 0 AND discount_percent <= 100),
  CONSTRAINT "coupons_times_used_non_negative"
    CHECK (times_used >= 0),
  CONSTRAINT "coupons_max_uses_positive"
    CHECK (max_uses IS NULL OR max_uses > 0)
);

-- ─── Column comments (visible in Supabase dashboard) ─────────────────────────
COMMENT ON TABLE  public."coupons"                    IS 'Discount coupons for license purchases';
COMMENT ON COLUMN public."coupons"."code"             IS 'Unique coupon code customers enter at checkout';
COMMENT ON COLUMN public."coupons"."discount_percent" IS 'Percentage discount (0.01 – 100.00)';
COMMENT ON COLUMN public."coupons"."is_active"        IS 'False = coupon is disabled but kept for history';
COMMENT ON COLUMN public."coupons"."max_uses"         IS 'NULL = unlimited uses';
COMMENT ON COLUMN public."coupons"."times_used"       IS 'Running count of how many times this code was redeemed';
COMMENT ON COLUMN public."coupons"."expires_at"       IS 'NULL = never expires';

-- ─── End of migration ────────────────────────────────────────────────────────
