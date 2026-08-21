import { createClient } from "@/lib/supabase/server";
import { getCurrentVendor } from "@/lib/tenant";

export type SeasonalAnnouncement = { productName: string; productSlug: string; daysRemaining: number; harvestSeasonEnd: string };

export async function getSeasonalAnnouncement(): Promise<SeasonalAnnouncement | null> {
  const supabase = await createClient();
  const vendor = await getCurrentVendor();
  const { data } = await supabase
    .from("products")
    .select("name, slug, harvest_season_end")
    .eq("vendor_id", vendor.id)
    .eq("status", "published")
    .eq("is_seasonal", true)
    .not("harvest_season_end", "is", null)
    .order("harvest_season_end", { ascending: true });

  if (!data || data.length === 0) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (const product of data) {
    const end = new Date(product.harvest_season_end!);
    const daysRemaining = Math.ceil((end.getTime() - today.getTime()) / 86_400_000);
    if (daysRemaining >= 0 && daysRemaining <= 30) {
      return { productName: product.name, productSlug: product.slug, daysRemaining, harvestSeasonEnd: product.harvest_season_end! };
    }
  }
  return null;
}
