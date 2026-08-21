import { createClient } from "@/lib/supabase/server";
import { getCurrentVendor } from "@/lib/tenant";

export type FrequentlyBoughtProduct = { id: string; slug: string; name: string; image: string | null; price: number | null; discount_price: number | null };

export async function getFrequentlyBoughtTogether(currentProductId: string, currentSlug: string): Promise<FrequentlyBoughtProduct[]> {
  const supabase = await createClient();
  const vendor = await getCurrentVendor();
  const { data } = await supabase
    .from("products")
    .select("id, slug, name, image, price, discount_price, rating_avg")
    .eq("vendor_id", vendor.id)
    .eq("status", "published")
    .neq("id", currentProductId)
    .order("rating_avg", { ascending: false });

  if (!data) return [];
  const giftBox = data.find((p) => p.slug === "gift-box");
  const others = data.filter((p) => p.slug !== "gift-box");
  const picks = currentSlug === "gift-box" ? others : [giftBox, ...others].filter(Boolean);
  return picks.slice(0, 2) as FrequentlyBoughtProduct[];
}
