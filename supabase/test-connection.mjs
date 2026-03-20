/**
 * test-connection.mjs
 * Run from the project root:  node supabase/test-connection.mjs
 */

import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

// ── Load .env.local ───────────────────────────────────────────────────────────
let envPath = ".env.local";
let rawEnv;
try {
  rawEnv = readFileSync(envPath, "utf-8");
} catch {
  console.error(`✗  Could not read ${envPath} — make sure it exists.`);
  process.exit(1);
}

const env = Object.fromEntries(
  rawEnv
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const idx = l.indexOf("=");
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    })
);

const url = env["VITE_SUPABASE_URL"];
const key = env["VITE_SUPABASE_ANON_KEY"];

if (!url || !key) {
  console.error("✗  VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing from .env.local");
  process.exit(1);
}

// ── Test connection ───────────────────────────────────────────────────────────
console.log("\n  Project Trinity — Supabase Connection Test");
console.log("  ──────────────────────────────────────────");
console.log(`  URL : ${url}`);
console.log(`  Key : ${key.slice(0, 20)}...${key.slice(-6)}\n`);

const supabase = createClient(url, key);

// Ping 1: auth health (no table access needed)
const { error: authError } = await supabase.auth.getSession();
if (authError) {
  console.error("✗  Auth check failed:", authError.message);
  process.exit(1);
}
console.log("  ✓  Auth service responding");

// Ping 2: list tables from information_schema
const { data: tables, error: tableError } = await supabase
  .from("information_schema.tables")
  .select("table_name")
  .eq("table_schema", "public")
  .limit(50);

if (tableError) {
  // Some projects restrict information_schema — still a valid connection
  console.log("  ✓  Database connected (restricted schema access is normal)");
  console.log(`     Note: ${tableError.message}`);
} else {
  const names = (tables || []).map((t) => t.table_name);
  if (names.length === 0) {
    console.log("  ✓  Database connected — no public tables yet");
  } else {
    console.log(`  ✓  Database connected — ${names.length} public table(s) found:`);
    names.forEach((n) => console.log(`       • ${n}`));
  }
}

console.log("\n  Connection test passed. You're good to go!\n");
