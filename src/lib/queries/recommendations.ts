import { createClient } from "@/lib/supabase/server";

export type RecommendedProduct = {
  id: string;
  slug: string;
  name: string;
  image: string | null;
  price: number | null;
  discount_price: number | null;
  rating_avg: number;
};

// Rule-based, not ML: recommends published products the customer hasn't
// already bought, ranked by rating. Falls back to top-rated overall if
// they've bought everything. No new infrastructure -- this is intentionally
// simple and swappable for a real recommendation engine later without
// changing where it's called from.
export async function getRecommendationsForCurrentUser(limit = 4): Promise<RecommendedProduct[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: products } = await supabase
    .from("products")
    .select("id, slug, name, image, price, discount_price, rating_avg")
    .eq("status", "published")
    .order("rating_avg", { ascending: false });

  if (!products) return [];
  if (!user) return products.slice(0, limit);

  const { data: orders } = await supabase
    .from("orders")
    .select("items")
    .eq("customer_id", user.id)
    .neq("status", "cancelled");

  const purchasedProductIds = new Set<string>();
  for (const order of orders ?? []) {
    const items = (order.items as { product_id?: string }[] | null) ?? [];
    for (const item of items) {
      if (item.product_id) purchasedProductIds.add(item.product_id);
    }
  }

  const notYetPurchased = products.filter((p) => !purchasedProductIds.has(p.id));
  const ranked = notYetPurchased.length > 0 ? notYetPurchased : products;

  return ranked.slice(0, limit);
}
