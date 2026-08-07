import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { createClient } from "@/lib/supabase/server";

// Server Action / Server Component variant of getShippingRate in
// ./shipping.ts -- same logic, but takes an already-created server client
// instead of constructing a browser client (which doesn't work outside
// the browser).
export async function getShippingRateServer(
  supabase: SupabaseClient<Database>,
  province: string,
  city: string
): Promise<number> {
  const { data } = await supabase
    .from("shipping_zones")
    .select("city, rate")
    .eq("province", province)
    .eq("active", true);

  if (!data || data.length === 0) return 250;

  const cityMatch = data.find((z) => z.city?.toLowerCase() === city.trim().toLowerCase());
  if (cityMatch) return Number(cityMatch.rate);

  const provinceDefault = data.find((z) => z.city === null);
  return provinceDefault ? Number(provinceDefault.rate) : 250;
}

// Real, named cities the business actually delivers to (from shipping_zones
// city-level overrides) grouped by province, for the homepage delivery
// coverage section -- not a fabricated "we deliver everywhere" map.
export async function getDeliveryCoverage(): Promise<Record<string, string[]>> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("shipping_zones")
    .select("province, city")
    .eq("active", true)
    .not("city", "is", null)
    .order("province", { ascending: true });

  const byProvince: Record<string, string[]> = {};
  for (const zone of data ?? []) {
    if (!zone.city) continue;
    (byProvince[zone.province] ??= []).push(zone.city);
  }
  return byProvince;
}
