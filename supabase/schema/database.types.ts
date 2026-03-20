/**
 * database.types.ts
 *
 * Hand-maintained types derived from the live schema dump.
 * Regenerate at any time with:
 *
 *   npx supabase gen types typescript \
 *     --project-id pozwzuinjkgdyyyqbohz \
 *     --schema public \
 *     > supabase/schema/database.types.ts
 *
 * See supabase/README.md for full instructions.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {

      /** public.licenses — issued software licenses */
      licenses: {
        Row: {
          id:            string;               // uuid PK
          customer_name: string;
          email:         string;
          license_key:   string;
          plan:          "starter" | "pro" | "starter-annual" | "pro-annual"; // migration 003
          billing_type:  "monthly" | "annual";                               // migration 003
          start_date:    string;               // timestamptz
          expiry_date:   string;               // timestamptz
          is_active:     boolean;
          created_at:    string | null;        // timestamptz
          updated_at:    string | null;        // timestamptz
        };
        Insert: {
          id?:           string;
          customer_name: string;
          email:         string;
          license_key:   string;
          plan?:         "starter" | "pro" | "starter-annual" | "pro-annual";
          billing_type?: "monthly" | "annual";
          start_date?:   string;
          expiry_date:   string;
          is_active?:    boolean;
          created_at?:   string;
          updated_at?:   string;
        };
        Update: {
          id?:           string;
          customer_name?: string;
          email?:         string;
          license_key?:   string;
          plan?:          "starter" | "pro" | "starter-annual" | "pro-annual";
          billing_type?:  "monthly" | "annual";
          start_date?:    string;
          expiry_date?:   string;
          is_active?:     boolean;
          created_at?:    string;
          updated_at?:    string;
        };
      };

      /** public.coupons — discount coupon codes (migration 001) */
      coupons: {
        Row: {
          id:               string;            // uuid PK
          code:             string;            // unique
          discount_percent: number;            // numeric(5,2) — 0.01 to 100
          is_active:        boolean;
          max_uses:         number | null;     // null = unlimited
          times_used:       number;
          expires_at:       string | null;     // timestamptz — null = never
          created_at:       string;
          updated_at:       string;
        };
        Insert: {
          id?:              string;
          code:             string;
          discount_percent: number;
          is_active?:       boolean;
          max_uses?:        number | null;
          times_used?:      number;
          expires_at?:      string | null;
          created_at?:      string;
          updated_at?:      string;
        };
        Update: {
          id?:              string;
          code?:            string;
          discount_percent?: number;
          is_active?:       boolean;
          max_uses?:        number | null;
          times_used?:      number;
          expires_at?:      string | null;
          created_at?:      string;
          updated_at?:      string;
        };
      };

      /** public.orders — payment lifecycle tracking (migration 002) */
      orders: {
        Row: {
          id:                     string;      // uuid PK
          order_id:               string;      // unique client ref
          customer_name:          string;
          email:                  string;
          plan:                   "starter" | "pro" | "starter-annual" | "pro-annual";
          amount_usd:             number;
          coupon_code:            string | null;
          status:                 "pending" | "confirmed" | "failed" | "expired";
          nowpayments_payment_id: string | null;
          license_id:             string | null; // FK → licenses.id
          created_at:             string;
          updated_at:             string;
        };
        Insert: {
          id?:                    string;
          order_id:               string;
          customer_name:          string;
          email:                  string;
          plan:                   "starter" | "pro" | "starter-annual" | "pro-annual";
          amount_usd:             number;
          coupon_code?:           string | null;
          status?:                "pending" | "confirmed" | "failed" | "expired";
          nowpayments_payment_id?: string | null;
          license_id?:            string | null;
          created_at?:            string;
          updated_at?:            string;
        };
        Update: {
          id?:                    string;
          order_id?:              string;
          customer_name?:         string;
          email?:                 string;
          plan?:                  "starter" | "pro" | "starter-annual" | "pro-annual";
          amount_usd?:            number;
          coupon_code?:           string | null;
          status?:                "pending" | "confirmed" | "failed" | "expired";
          nowpayments_payment_id?: string | null;
          license_id?:            string | null;
          created_at?:            string;
          updated_at?:            string;
        };
      };

    };
    Views:     Record<string, never>;
    Functions: Record<string, never>;
    Enums:     Record<string, never>;
  };
}
