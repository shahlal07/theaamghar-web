import { createClient } from "@/lib/supabase/client";

const PAKISTAN_PROVINCES = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Islamabad Capital Territory",
  "Azad Kashmir",
  "Gilgit-Baltistan",
] as const;

export { PAKISTAN_PROVINCES };

/* City-specific rate overrides a province's default rate when present
   (e.g. Lahore is cheaper than the rest of Punjab). Matching is
   case-insensitive since customers type city names freely. */
export async function getShippingRate(province: string, city: string, vendorId: string): Promise<number> {
  const supabase = createClient();

  const { data } = await supabase
    .from("shipping_zones")
    .select("city, rate")
    .eq("vendor_id", vendorId)
    .eq("province", province)
    .eq("active", true);

  if (!data || data.length === 0) return 250; // business_settings.default_shipping_cost fallback

  const cityMatch = data.find((z) => z.city?.toLowerCase() === city.trim().toLowerCase());
  if (cityMatch) return Number(cityMatch.rate);

  const provinceDefault = data.find((z) => z.city === null);
  return provinceDefault ? Number(provinceDefault.rate) : 250;
}

// null means the feature is off -- this business's shipping is otherwise a
// flat zone-based fee with no "free above X" concept until an admin sets
// this in Settings, so the cart must not fabricate a progress bar without it.
export async function getFreeShippingThreshold(vendorId: string): Promise<number | null> {
  const supabase = createClient();
  // business_settings itself is admin-only RLS -- public_business_settings
  // is the view that exposes just the customer-facing columns to anon too.
  // .single() (not .maybeSingle()) used to error/return null the moment a
  // second vendor's row existed in this now-shared view.
  const { data } = await supabase
    .from("public_business_settings")
    .select("free_shipping_threshold")
    .eq("vendor_id", vendorId)
    .maybeSingle();
  return data?.free_shipping_threshold ?? null;
}
