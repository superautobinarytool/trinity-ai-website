-- ═══════════════════════════════════════════════════════════════════════════
-- Project Trinity — Migration
-- File    : 004_fix_licenses_unique_constraints.sql
-- Created : 2026-03-21
-- Problem : licenses.email had a UNIQUE constraint, so a returning customer
--           (renewal, plan change, or second seat) got a 23505 duplicate key
--           error and lost their license + email delivery.
-- Fix     :
--   1. DROP the unique constraint on email  — one email may own many licenses
--   2. ADD  a unique constraint on license_key — each key is one-time only
--   3. ADD  an index on email for fast lookups without enforcing uniqueness
-- Safe to re-run — all operations use IF EXISTS / IF NOT EXISTS guards.
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── 1. Drop the incorrectly-unique constraint on email ──────────────────────
ALTER TABLE public."licenses"
  DROP CONSTRAINT IF EXISTS "licenses_email_key";

-- Also cover any alternate naming Supabase may have used
ALTER TABLE public."licenses"
  DROP CONSTRAINT IF EXISTS "licenses_email_unique";

-- ─── 2. Ensure license_key is unique (safety net beyond the app-level check) ─
ALTER TABLE public."licenses"
  DROP CONSTRAINT IF EXISTS "licenses_license_key_key";

ALTER TABLE public."licenses"
  DROP CONSTRAINT IF EXISTS "licenses_license_key_unique";

ALTER TABLE public."licenses"
  ADD CONSTRAINT "licenses_license_key_unique"
    UNIQUE ("license_key");

-- ─── 3. Non-unique index on email for fast customer lookups ──────────────────
CREATE INDEX IF NOT EXISTS "licenses_email_idx"
  ON public."licenses" ("email");

-- ─── End of migration ────────────────────────────────────────────────────────
