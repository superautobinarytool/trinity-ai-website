/**
 * seed-coupons.mjs
 * Inserts sample coupon codes into the coupons table.
 * Run from the project root:  node supabase/seed-coupons.mjs
 *
 * Safe to re-run — uses upsert on the unique `code` column so existing
 * coupons are updated rather than duplicated.
 */

import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

// ── Load .env.local ───────────────────────────────────────────────────────────
const rawEnv = readFileSync(".env.local", "utf-8");
const env = Object.fromEntries(
  rawEnv.split("\n").map(l => l.trim())
    .filter(l => l && !l.startsWith("#") && l.includes("="))
    .map(l => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);

const supabase = createClient(
  env["VITE_SUPABASE_URL"],
  env["SUPABASE_SERVICE_ROLE_KEY"],   // service role bypasses RLS
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// ── Sample coupon data ────────────────────────────────────────────────────────
const coupons = [
  {
    code:             "TRINITY20",
    discount_percent: 20.00,
    is_active:        true,
    max_uses:         null,           // unlimited
    times_used:       0,
    expires_at:       null,           // never expires
  },
  {
    code:             "LAUNCH10",
    discount_percent: 10.00,
    is_active:        true,
    max_uses:         null,
    times_used:       0,
    expires_at:       null,
  },
  {
    code:             "WELCOME15",
    discount_percent: 15.00,
    is_active:        true,
    max_uses:         100,            // first 100 uses only
    times_used:       0,
    expires_at:       null,
  },
  {
    code:             "VIP30",
    discount_percent: 30.00,
    is_active:        true,
    max_uses:         50,             // exclusive — 50 uses
    times_used:       0,
    expires_at:       null,
  },
  {
    code:             "DISCORD25",
    discount_percent: 25.00,
    is_active:        true,
    max_uses:         null,
    times_used:       0,
    expires_at:       "2026-06-30T23:59:59+00:00",  // expires end of June
  },
  {
    code:             "HALFOFF",
    discount_percent: 50.00,
    is_active:        false,          // disabled — kept for history
    max_uses:         10,
    times_used:       0,
    expires_at:       null,
  },
];

// ── Upsert ────────────────────────────────────────────────────────────────────
console.log("\n  Seeding coupons table...");
console.log("  ─────────────────────────────────────────\n");

const { data, error } = await supabase
  .from("coupons")
  .upsert(coupons, { onConflict: "code", ignoreDuplicates: false })
  .select("code, discount_percent, is_active, max_uses, expires_at");

if (error) {
  console.error("  ✗  Seed failed:", error.message);
  console.error("     Make sure migration 001_create_coupons.sql has been run first.\n");
  process.exit(1);
}

console.log(`  ✓  ${data.length} coupon(s) upserted:\n`);
console.log(
  "  " +
  ["Code".padEnd(14), "Discount".padEnd(10), "Active".padEnd(8), "Max Uses".padEnd(10), "Expires"].join("")
);
console.log("  " + "─".repeat(60));
data.forEach(c => {
  console.log(
    "  " + [
      String(c.code).padEnd(14),
      `${c.discount_percent}%`.padEnd(10),
      String(c.is_active).padEnd(8),
      (c.max_uses ?? "Unlimited").toString().padEnd(10),
      c.expires_at ? new Date(c.expires_at).toLocaleDateString("en-GB") : "Never",
    ].join("")
  );
});
console.log();
