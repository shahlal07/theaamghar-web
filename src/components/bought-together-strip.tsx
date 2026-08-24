"use client";

import { useEffect, useState } from "react";
import {
  getFrequentlyBoughtTogetherClient,
  type FrequentlyBoughtProduct,
} from "@/lib/queries/frequently-bought-together-client";
import { MiniProductCard } from "@/components/account/mini-product-card";

// Shown in the cart sidebar and on checkout -- the product page already has
// its own equivalent (queries/frequently-bought-together.ts's
// getFrequentlyBoughtTogether(), keyed off a single "current product").
// Horizontal scroll rather than a wrapping grid: this renders inside
// already-narrow containers (the cart sidebar, checkout's order-summary
// column) where a 2-up grid would feel as cramped as the homepage cards did.
export function BoughtTogetherStrip({
  vendorId,
  excludeProductIds,
}: {
  vendorId: string | null;
  excludeProductIds: string[];
}) {
  const [products, setProducts] = useState<FrequentlyBoughtProduct[] | null>(null);
  const excludeKey = excludeProductIds.join(",");

  useEffect(() => {
    // No vendorId yet (cart lines still resolving) -- skip the fetch and
    // leave products at its initial null, which already renders nothing.
    if (!vendorId) return;
    let cancelled = false;
    getFrequentlyBoughtTogetherClient(vendorId, excludeProductIds).then((result) => {
      if (!cancelled) setProducts(result);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorId, excludeKey]);

  if (!products || products.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-bold mb-3">Frequently Bought Together</h3>
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
        {products.map((p) => (
          <div key={p.id} className="w-32 shrink-0">
            <MiniProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
