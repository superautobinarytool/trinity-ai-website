import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | undefined;

/**
 * Returns the server-side Supabase client (service role, bypasses RLS).
 * Lazily initialised on first call so a missing env var crashes the handler
 * with a clear message rather than killing the entire module on import.
 * ONLY use inside serverless functions — never expose to the browser.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "[supabase-admin] VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set. " +
      "Add these in your Vercel project → Settings → Environment Variables."
    );
  }
  _client = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return _client;
}

