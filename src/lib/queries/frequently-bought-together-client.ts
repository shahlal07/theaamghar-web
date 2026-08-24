import { createClient } from "@/lib/supabase/client";

export type FrequentlyBoughtProduct = { id: string; slug: string; name: string; image: string | null; price: number | null; discount_price: number | null };

// Client-side counterpart to queries/frequently-bought-together.ts's
// getFrequentlyBoughtTogether() -- that one needs a single "current product"
// (the product detail page), which the cart sidebar and checkout don't have
// (they can hold several different products at once). This suggests other
// published products from the SAME vendor as what's already in the cart,
// excluding anything already there. vendorId must be passed explicitly
// (resolved from the cart's own resolved lines) rather than re-derived here
// -- unlike the server helper, there's no per-request tenant context
// available client-side, and this table's public-read RLS policy is not
// itself vendor-scoped, so an unfiltered query would leak other vendors'
// products into the suggestion strip.
export async function getFrequentlyBoughtTogetherClient(
  vendorId: string,
  excludeProductIds: string[],
  limit = 4
): Promise<FrequentlyBoughtProduct[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("id, slug, name, image, price, discount_price")
    .eq("vendor_id", vendorId)
    .eq("status", "published")
    .order("rating_avg", { ascending: false })
    .limit(limit + excludeProductIds.length);

  if (!data) return [];
  const excluded = new Set(excludeProductIds);
  return data.filter((p) => !excluded.has(p.id)).slice(0, limit);
}
