/**
 * dump-table.mjs
 * Extracts the full structure and data of a Supabase table and writes
 * it as a portable SQL file.
 *
 * Usage:  node supabase/dump-table.mjs licences
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

// ── Load .env.local ───────────────────────────────────────────────────────────
let rawEnv;
try {
  rawEnv = readFileSync(".env.local", "utf-8");
} catch {
  console.error("✗  Could not read .env.local");
  process.exit(1);
}
const env = Object.fromEntries(
  rawEnv.split("\n").map(l => l.trim())
    .filter(l => l && !l.startsWith("#") && l.includes("="))
    .map(l => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);

const BASE_URL   = env["VITE_SUPABASE_URL"];
const ANON_KEY   = env["VITE_SUPABASE_ANON_KEY"];
// Service role bypasses RLS — essential for a full data dump
const AUTH_KEY   = env["SUPABASE_SERVICE_ROLE_KEY"] || ANON_KEY;

const TABLE_NAME = process.argv[2] || "licences";

const headers = {
  "apikey": AUTH_KEY,
  "Authorization": `Bearer ${AUTH_KEY}`,
  "Content-Type": "application/json",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
async function restGet(path, extraHeaders = {}) {
  const res = await fetch(`${BASE_URL}/rest/v1/${path}`, {
    headers: { ...headers, ...extraHeaders },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${await res.text()}`);
  return res.json();
}

// ── 1. Column definitions via OpenAPI introspection ──────────────────────────
// Supabase always exposes GET /rest/v1/ as an OpenAPI 2.0 spec describing
// every table, column, type, and constraint visible to the current role.
console.log(`\n  Fetching schema via OpenAPI introspection...`);

const openApiRes = await fetch(`${BASE_URL}/rest/v1/`, { headers });
if (!openApiRes.ok) {
  console.error("  ✗  Could not fetch OpenAPI spec:", openApiRes.status, openApiRes.statusText);
  process.exit(1);
}
const openApi = await openApiRes.json();

const defKey = Object.keys(openApi.definitions || {}).find(
  k => k.toLowerCase() === TABLE_NAME.toLowerCase()
);
if (!defKey) {
  console.error(`  ✗  Table "${TABLE_NAME}" not found in OpenAPI definitions.`);
  console.log("  Available tables:", Object.keys(openApi.definitions || {}).join(", ") || "(none)");
  process.exit(1);
}

const def = openApi.definitions[defKey];

// OpenAPI 2.0 "required" array lists NOT NULL columns (those without defaults)
const requiredCols = new Set(def.required || []);

// Map OpenAPI/JSON-Schema types → PostgreSQL types
function openApiTypeToPg(colName, prop) {
  const fmt  = prop.format;
  const type = prop.type;
  const desc = prop.description || "";

  if (fmt === "uuid")                        return "uuid";
  if (fmt === "timestamp with time zone")    return "timestamp with time zone";
  if (fmt === "timestamp without time zone") return "timestamp without time zone";
  if (fmt === "date")                        return "date";
  if (fmt === "time")                        return "time";
  if (fmt === "bigint")                      return "bigint";
  if (fmt === "smallint")                    return "smallint";
  if (fmt === "integer")                     return "integer";
  if (fmt === "real")                        return "real";
  if (fmt === "double precision")            return "double precision";
  if (fmt === "numeric")                     return "numeric";
  if (fmt === "boolean" || type === "boolean") return "boolean";
  if (fmt === "json" || fmt === "jsonb")     return fmt || "jsonb";
  if (type === "array")                      return "jsonb";  // safe fallback
  if (type === "integer" || type === "number") return "integer";
  if (type === "string" && fmt === "character varying") return "text";
  // Check description hints added by PostgREST
  if (desc.includes("bigint"))    return "bigint";
  if (desc.includes("smallint"))  return "smallint";
  if (desc.includes("integer"))   return "integer";
  if (desc.includes("numeric"))   return "numeric";
  if (desc.includes("boolean"))   return "boolean";
  if (desc.includes("uuid"))      return "uuid";
  if (desc.includes("jsonb"))     return "jsonb";
  if (desc.includes("json"))      return "json";
  if (desc.includes("timestamp")) return "timestamp with time zone";
  return "text"; // safe fallback for strings
}

const props = def.properties || {};
const columns = Object.entries(props).map(([colName, prop]) => ({
  column_name: colName,
  pg_type: openApiTypeToPg(colName, prop),
  is_nullable: requiredCols.has(colName) ? "NO" : "YES",
  description: prop.description || null,
  default_val: prop.default !== undefined ? String(prop.default) : null,
}));

// Try to detect PK — PostgREST sets description="Note: This is a Primary Key."
const pkCols = columns
  .filter(c => c.description && c.description.includes("Primary Key"))
  .map(c => c.column_name);

console.log(`  ✓  ${columns.length} column(s) found`);
console.log(`  ✓  PK columns: [${pkCols.join(", ") || "none auto-detected"}]`);

// ── 2. All rows ───────────────────────────────────────────────────────────────
console.log(`  Fetching all rows from "${TABLE_NAME}"...`);
let rows = [];
try {
  // Fetch in pages of 1000 to handle large datasets
  let offset = 0;
  const PAGE = 1000;
  while (true) {
    const res = await fetch(
      `${BASE_URL}/rest/v1/${TABLE_NAME}?select=*&offset=${offset}&limit=${PAGE}`,
      { headers: { ...headers, "Prefer": "count=none" } }
    );
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${await res.text()}`);
    const page = await res.json();
    rows = rows.concat(page);
    if (page.length < PAGE) break;
    offset += PAGE;
  }
  console.log(`  ✓  ${rows.length} row(s) retrieved`);
} catch (err) {
  console.error("  ✗  Could not fetch rows:", err.message);
  process.exit(1);
}

// ── 3. Build SQL ──────────────────────────────────────────────────────────────
function sqlLiteral(val) {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "boolean") return val ? "TRUE" : "FALSE";
  if (typeof val === "number") return String(val);
  if (typeof val === "object") return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
  return `'${String(val).replace(/'/g, "''")}'`;
}

const now = new Date().toISOString();
const colDefs = columns.map(col => {
  let def = `  "${col.column_name}" ${col.pg_type}`;
  if (col.default_val !== null) def += ` DEFAULT ${col.default_val}`;
  if (col.is_nullable === "NO") def += " NOT NULL";
  return def;
});

if (pkCols.length > 0) {
  colDefs.push(`  CONSTRAINT "${TABLE_NAME}_pkey" PRIMARY KEY (${pkCols.map(c => `"${c}"`).join(", ")})`);
}

let sql = `-- ═══════════════════════════════════════════════════════════════════════════
-- Project Trinity — Supabase Table Dump
-- Table  : public.${TABLE_NAME}
-- Dumped : ${now}
-- Rows   : ${rows.length}
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── Drop & recreate (safe restore) ─────────────────────────────────────────
DROP TABLE IF EXISTS public."${TABLE_NAME}" CASCADE;

-- ─── Table structure ─────────────────────────────────────────────────────────
CREATE TABLE public."${TABLE_NAME}" (
${colDefs.join(",\n")}
);

`;

if (rows.length > 0) {
  const colNames = columns.map(c => `"${c.column_name}"`).join(", ");
  sql += `-- ─── Data (${rows.length} row${rows.length === 1 ? "" : "s"}) ─────────────────────────────────────────────────────────\n`;
  sql += `INSERT INTO public."${TABLE_NAME}" (${colNames}) VALUES\n`;
  const valueRows = rows.map(
    row => `  (${columns.map(c => sqlLiteral(row[c.column_name])).join(", ")})`
  );
  sql += valueRows.join(",\n") + ";\n";
} else {
  sql += `-- ─── No rows in table ────────────────────────────────────────────────────────\n`;
}

sql += `\n-- ─── End of dump ────────────────────────────────────────────────────────────\n`;

// ── 5. Write file ─────────────────────────────────────────────────────────────
const outPath = join("supabase", "schema", `${TABLE_NAME}.sql`);
writeFileSync(outPath, sql, "utf-8");

console.log(`\n  ✓  Dump written to: ${outPath}`);
console.log(`     ${columns.length} columns · ${rows.length} rows\n`);
