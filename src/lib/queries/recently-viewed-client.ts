import { createClient } from "@/lib/supabase/client";

export type RecentlyViewedProduct = {
  id: string;
  slug: string;
  name: string;
  image: string | null;
  price: number | null;
  discount_price: number | null;
};

export async function getRecentlyViewedProducts(slugs: string[]): Promise<RecentlyViewedProduct[]> {
  if (slugs.length === 0) return [];
  const supabase = createClient();

  const { data } = await supabase
    .from("products")
    .select("id, slug, name, image, price, discount_price, status")
    .in("slug", slugs)
    .eq("status", "published");

  if (!data) return [];

  // Preserve the original most-recent-first order (the .in() query doesn't
  // guarantee it), and re-drop anything that's no longer published.
  const bySlug = new Map(data.map((p) => [p.slug, p]));
  return slugs.map((s) => bySlug.get(s)).filter((p): p is NonNullable<typeof p> => Boolean(p));
}
