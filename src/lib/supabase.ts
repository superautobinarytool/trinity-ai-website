/**
 * Re-exports the Supabase client for use throughout the application.
 * Import from here in all components and hooks:
 *
 *   import { supabase } from "@/lib/supabase";
 */
export { supabase } from "../../supabase/client";
export type { Database } from "../../supabase/schema/database.types";
