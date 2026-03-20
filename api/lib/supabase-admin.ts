import { createClient } from "@supabase/supabase-js";

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  throw new Error(
    "[supabase-admin] VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set."
  );
}

/**
 * Server-side Supabase client that uses the service role key.
 * Bypasses Row Level Security — ONLY use in serverless functions, never expose to the browser.
 */
export const supabaseAdmin = createClient(url, key, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
