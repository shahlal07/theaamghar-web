import { createClient } from "@/lib/supabase/server";

export type FrequentlyBoughtProduct = {
  id: string;
  slug: string;
  name: string;
  image: string | null;
  price: number | null;
  discount_price: number | null;
};

// Rule-based, not behavioral: the gift box (containing several varieties)
// is the natural pairing for anyone browsing a single variety, and vice
// versa a single top-rated variety pairs with the gift box. Swappable for
// real co-purchase analysis later without changing where it's called from.
export async function getFrequentlyBoughtTogether(
  currentProductId: string,
  currentSlug: string
): Promise<FrequentlyBoughtProduct[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("products")
    .select("id, slug, name, image, price, discount_price, rating_avg")
    .eq("status", "published")
    .neq("id", currentProductId)
    .order("rating_avg", { ascending: false });

  if (!data) return [];

  const giftBox = data.find((p) => p.slug === "gift-box");
  const others = data.filter((p) => p.slug !== "gift-box");

  const picks = currentSlug === "gift-box" ? others : [giftBox, ...others].filter(Boolean);

  return picks.slice(0, 2) as FrequentlyBoughtProduct[];
}
