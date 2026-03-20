-- ═══════════════════════════════════════════════════════════════════════════
-- Project Trinity — Supabase Table Dump
-- Table  : public.licenses
-- Dumped : 2026-03-19T22:24:24.173Z
-- Rows   : 1
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── Drop & recreate (safe restore) ─────────────────────────────────────────
DROP TABLE IF EXISTS public."licenses" CASCADE;

-- ─── Table structure ─────────────────────────────────────────────────────────
CREATE TABLE public."licenses" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "customer_name" text NOT NULL,
  "email" text NOT NULL,
  "license_key" text NOT NULL,
  "start_date" timestamp with time zone DEFAULT now() NOT NULL,
  "expiry_date" timestamp with time zone NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "licenses_pkey" PRIMARY KEY ("id")
);

-- ─── Data (1 row) ─────────────────────────────────────────────────────────
INSERT INTO public."licenses" ("id", "customer_name", "email", "license_key", "start_date", "expiry_date", "is_active", "created_at", "updated_at") VALUES
  ('c0680174-618f-455d-a42b-857aab37a5b5', 'Tester', 'test@example.com', 'ABCD1234EFGH5677', '2026-02-25T05:35:12+00:00', '2026-03-22T04:23:02.273202+00:00', TRUE, '2026-02-26T03:01:04.690843+00:00', '2026-02-26T04:23:02.273202+00:00');

-- ─── End of dump ────────────────────────────────────────────────────────────
