import { createClient } from "@/lib/supabase/server";
import { getCurrentVendor } from "@/lib/tenant";

export type RecommendedProduct = { id: string; slug: string; name: string; image: string | null; price: number | null; discount_price: number | null; rating_avg: number };

export async function getRecommendationsForCurrentUser(limit = 4): Promise<RecommendedProduct[]> {
  const supabase = await createClient();
  const vendor = await getCurrentVendor();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: products } = await supabase
    .from("products")
    .select("id, slug, name, image, price, discount_price, rating_avg")
    .eq("vendor_id", vendor.id)
    .eq("status", "published")
    .order("rating_avg", { ascending: false });

  if (!products) return [];
  if (!user) return products.slice(0, limit);

  const { data: orders } = await supabase
    .from("orders")
    .select("items")
    .eq("vendor_id", vendor.id)
    .eq("customer_id", user.id)
    .neq("status", "cancelled");

  const purchasedProductIds = new Set<string>();
  for (const order of orders ?? []) {
    const items = (order.items as { product_id?: string }[] | null) ?? [];
    for (const item of items) if (item.product_id) purchasedProductIds.add(item.product_id);
  }

  const notYetPurchased = products.filter((p) => !purchasedProductIds.has(p.id));
  const ranked = notYetPurchased.length > 0 ? notYetPurchased : products;
  return ranked.slice(0, limit);
}
