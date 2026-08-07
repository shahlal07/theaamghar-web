"use client";

import { useEffect, useState } from "react";
import { getRecentlyViewedSlugs } from "@/lib/recently-viewed";
import { getRecentlyViewedProducts, type RecentlyViewedProduct } from "@/lib/queries/recently-viewed-client";
import { MiniProductCard } from "@/components/account/mini-product-card";

export function RecentlyViewedStrip({
  excludeSlug,
  limit = 4,
}: {
  excludeSlug?: string;
  limit?: number;
}) {
  const [products, setProducts] = useState<RecentlyViewedProduct[] | null>(null);

  useEffect(() => {
    const slugs = getRecentlyViewedSlugs(excludeSlug).slice(0, limit);
    // getRecentlyViewedProducts short-circuits to [] for an empty slugs
    // array itself (still asynchronously), so this never needs to call
    // setState synchronously from within the effect body.
    getRecentlyViewedProducts(slugs).then(setProducts);
  }, [excludeSlug, limit]);

  if (!products || products.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-bold mb-3">Recently Viewed</h3>
      <div className="grid grid-cols-2 gap-3">
        {products.map((p) => (
          <MiniProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
