import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSupabaseAdmin } from "../lib/supabase-admin";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ valid: false });
    return;
  }

  const { code } = req.body ?? {};

  if (!code || typeof code !== "string" || !code.trim()) {
    res.status(400).json({ valid: false });
    return;
  }

  const { data: coupon } = await getSupabaseAdmin()
    .from("coupons")
    .select("code, discount_percent, is_active, max_uses, times_used, expires_at")
    .eq("code", code.trim().toUpperCase())
    .maybeSingle();

  if (!coupon || !coupon.is_active) {
    res.status(200).json({ valid: false });
    return;
  }

  const expired = coupon.expires_at
    ? new Date(coupon.expires_at) < new Date()
    : false;

  const maxedOut = coupon.max_uses !== null
    ? coupon.times_used >= coupon.max_uses
    : false;

  if (expired || maxedOut) {
    res.status(200).json({ valid: false });
    return;
  }

  res.status(200).json({
    valid:            true,
    discount_percent: Number(coupon.discount_percent),
    label:            `${coupon.code} — ${coupon.discount_percent}% off`,
  });
}
