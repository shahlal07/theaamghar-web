import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { createClient } from "@/lib/supabase/server";
import { getCurrentVendor } from "@/lib/tenant";

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

export async function getDeliveryCoverage(): Promise<Record<string, string[]>> {
  const supabase = await createClient();
  const vendor = await getCurrentVendor();
  const { data } = await supabase
    .from("shipping_zones")
    .select("province, city")
    .eq("vendor_id", vendor.id)
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
