import { createClient } from "@/lib/supabase/server";

export type SeasonalAnnouncement = {
  productName: string;
  productSlug: string;
  daysRemaining: number;
  harvestSeasonEnd: string;
};

// Only products with real harvest_season_end/start dates set can produce a
// countdown -- most of the current catalog only has the free-text `season`
// field (e.g. "May - August"), which isn't precise enough to count down
// from. Returns null rather than fabricating urgency for those.
export async function getSeasonalAnnouncement(): Promise<SeasonalAnnouncement | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("products")
    .select("name, slug, harvest_season_end")
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
      return {
        productName: product.name,
        productSlug: product.slug,
        daysRemaining,
        harvestSeasonEnd: product.harvest_season_end!,
      };
    }
  }

  return null;
}
