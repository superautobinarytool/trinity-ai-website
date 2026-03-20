import { createClient } from "@supabase/supabase-js";
import type { Database } from "./schema/database.types";

// ─── Validation ──────────────────────────────────────────────────────────────
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || supabaseUrl === "https://your-project-id.supabase.co") {
  throw new Error(
    "[Supabase] VITE_SUPABASE_URL is not set. " +
      "Copy .env.example → .env.local and fill in your project URL."
  );
}

if (!supabaseAnonKey || supabaseAnonKey === "your-anon-public-key-here") {
  throw new Error(
    "[Supabase] VITE_SUPABASE_ANON_KEY is not set. " +
      "Copy .env.example → .env.local and fill in your anon key."
  );
}

// ─── Singleton Client ─────────────────────────────────────────────────────────
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
