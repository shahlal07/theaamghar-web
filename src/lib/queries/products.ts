import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type ProductWithBoxSizes = {
  id: string;
  slug: string;
  name: string;
  product_type: string;
  attributes: Record<string, unknown>;
  origin: string | null;
  tagline: string | null;
  image: string | null;
  rating_avg: number;
  review_count: number;
  sweetness: string | null;
  fiber: string | null;
  season: string | null;
  created_at: string;
  boxSizes: {
    id: string;
    box_size_kg: number;
    selling_price: number;
    stock_qty: number;
  }[];
  variants: {
    id: string;
    attributes: Record<string, string>;
    label: string | null;
    selling_price: number;
    stock_qty: number;
  }[];
  minPrice: number | null;
  // Holds a product_box_sizes.id for 'fruit' products, a product_variants.id
  // for everything else -- defaultUnitSource says which. Kept as one field
  // (rather than renaming to something generic) so cart-context.tsx and
  // every existing box-size-only call site needs no change; only the
  // (new) non-fruit paths need to read defaultUnitSource at all.
  defaultBoxSizeId: string | null;
  defaultUnitSource: "box_size" | "variant";
  isBestSeller: boolean;
  isLimitedHarvest: boolean;
};

const LIMITED_HARVEST_WINDOW_DAYS = 30;

export async function getPublishedProducts(): Promise<ProductWithBoxSizes[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, name, product_type, attributes, origin, tagline, image, rating_avg, review_count, sweetness, fiber, season, created_at, sort_order, is_seasonal, harvest_season_end, product_box_sizes(id, box_size_kg, selling_price, stock_qty, active), product_variants(id, attributes, label, selling_price, stock_qty, active)"
    )
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (error || !data) return [];

  // "Best Seller" is the single highest review_count product -- a real,
  // derived-from-data signal, not an editorial label. Ties: whichever the
  // query returns first (sort_order), not worth breaking arbitrarily.
  const maxReviewCount = Math.max(0, ...data.map((p) => p.review_count));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return data.map((p) => {
    const activeSizes = (p.product_box_sizes ?? [])
      .filter((b) => b.active)
      .sort((a, b) => a.box_size_kg - b.box_size_kg);
    const activeVariants = (p.product_variants ?? [])
      .filter((v) => v.active)
      .map((v) => ({ ...v, attributes: (v.attributes ?? {}) as Record<string, string> }));

    const cheapestBox = activeSizes.reduce<
      (typeof activeSizes)[number] | null
    >((min, b) => (min === null || b.selling_price < min.selling_price ? b : min), null);
    const cheapestVariant = activeVariants.reduce<
      (typeof activeVariants)[number] | null
    >((min, v) => (min === null || v.selling_price < min.selling_price ? v : min), null);

    let isLimitedHarvest = false;
    if (p.is_seasonal && p.harvest_season_end) {
      const daysRemaining = Math.ceil(
        (new Date(p.harvest_season_end).getTime() - today.getTime()) / 86_400_000
      );
      isLimitedHarvest = daysRemaining >= 0 && daysRemaining <= LIMITED_HARVEST_WINDOW_DAYS;
    }

    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      product_type: p.product_type,
      attributes: (p.attributes ?? {}) as Record<string, unknown>,
      origin: p.origin,
      tagline: p.tagline,
      image: p.image,
      rating_avg: Number(p.rating_avg),
      review_count: p.review_count,
      sweetness: p.sweetness,
      fiber: p.fiber,
      season: p.season,
      created_at: p.created_at,
      boxSizes: activeSizes,
      variants: activeVariants,
      minPrice: cheapestBox
        ? Number(cheapestBox.selling_price)
        : cheapestVariant
          ? Number(cheapestVariant.selling_price)
          : null,
      defaultBoxSizeId: cheapestBox?.id ?? cheapestVariant?.id ?? null,
      defaultUnitSource: cheapestBox ? "box_size" : "variant",
      isBestSeller: maxReviewCount > 0 && p.review_count === maxReviewCount,
      isLimitedHarvest,
    };
  });
}

// Wrapped in React's cache() because generateMetadata() and the page
// component both call this for the same request -- cache() dedupes them
// into a single Supabase query instead of fetching twice.
export const getProductBySlug = cache(async (slug: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      "*, product_box_sizes(id, box_size_kg, selling_price, stock_qty, active), product_variants(id, attributes, label, selling_price, stock_qty, active, sort_order)"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) return null;

  const boxSizes = (data.product_box_sizes ?? [])
    .filter((b) => b.active)
    .sort((a, b) => a.box_size_kg - b.box_size_kg);
  const variants = (data.product_variants ?? [])
    .filter((v) => v.active)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((v) => ({ ...v, attributes: (v.attributes ?? {}) as Record<string, string> }));

  return { ...data, attributes: (data.attributes ?? {}) as Record<string, unknown>, boxSizes, variants };
});
