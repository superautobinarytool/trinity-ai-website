/**
 * run-migration.mjs
 * Executes a .sql migration file against Supabase via the REST SQL endpoint.
 *
 * Usage:  node supabase/run-migration.mjs supabase/migrations/001_create_coupons.sql
 */

import { readFileSync } from "fs";

// ── Load .env.local ───────────────────────────────────────────────────────────
const rawEnv = readFileSync(".env.local", "utf-8");
const env = Object.fromEntries(
  rawEnv.split("\n").map(l => l.trim())
    .filter(l => l && !l.startsWith("#") && l.includes("="))
    .map(l => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);

const BASE_URL       = env["VITE_SUPABASE_URL"];
const SERVICE_KEY    = env["SUPABASE_SERVICE_ROLE_KEY"];
const MIGRATION_FILE = process.argv[2];

if (!SERVICE_KEY) {
  console.error("✗  SUPABASE_SERVICE_ROLE_KEY missing from .env.local");
  process.exit(1);
}
if (!MIGRATION_FILE) {
  console.error("✗  Provide a migration file as the first argument");
  process.exit(1);
}

const sql = readFileSync(MIGRATION_FILE, "utf-8");
console.log(`\n  Running migration: ${MIGRATION_FILE}`);
console.log("  ──────────────────────────────────────────────────────");

const res = await fetch(`${BASE_URL}/rest/v1/rpc/exec_sql`, {
  method: "POST",
  headers: {
    "apikey": SERVICE_KEY,
    "Authorization": `Bearer ${SERVICE_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query: sql }),
});

// Supabase projects may or may not have the exec_sql RPC — try the pg endpoint
if (res.status === 404) {
  console.log("  (exec_sql RPC not found — trying /pg/query endpoint...)");
  const res2 = await fetch(`${BASE_URL}/pg/query`, {
    method: "POST",
    headers: {
      "apikey": SERVICE_KEY,
      "Authorization": `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  });
  if (!res2.ok) {
    const body = await res2.text();
    console.error(`  ✗  Migration failed (${res2.status}):`, body);
    process.exit(1);
  }
  const result = await res2.json();
  console.log("  ✓  Migration executed successfully");
  if (result?.rowCount !== undefined) console.log(`     rows affected: ${result.rowCount}`);
  console.log();
  process.exit(0);
}

if (!res.ok) {
  const body = await res.text();
  console.error(`  ✗  Migration failed (${res.status}):`, body);
  process.exit(1);
}

console.log("  ✓  Migration executed successfully\n");
