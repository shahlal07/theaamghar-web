"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/lib/toast-context";
import { toggleWishlist } from "@/lib/queries/wishlist";
import { productImageSrc } from "@/lib/product-image";
import { formatPKR } from "@/lib/format";
import type { ProductWithBoxSizes } from "@/lib/queries/products";

// Alert-preference chips are UI-ready but not wired to a real trigger yet
// -- no backend job compares old/new price or stock levels today. Clicking
// just toggles the visual state locally so the design doesn't need
// revisiting once that backend work lands; it isn't persisted anywhere yet.
const ALERT_TYPES = [
  { key: "priceDrop", label: "Price drop" },
  { key: "backInStock", label: "Back in stock" },
  { key: "seasonEnding", label: "Season ending" },
] as const;

export function WishlistCard({
  product,
  userId,
  onRemoved,
}: {
  product: ProductWithBoxSizes;
  userId: string;
  onRemoved: (productId: string) => void;
}) {
  const { addItem } = useCart();
  const showToast = useToast();
  const [removing, setRemoving] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState<Set<string>>(new Set());

  const soldOut = !product.defaultBoxSizeId || product.minPrice === null;

  async function handleRemove() {
    setRemoving(true);
    await toggleWishlist(userId, product.id, true);
    showToast("Removed from wishlist");
    onRemoved(product.id);
  }

  function handleAddToCart() {
    if (!product.defaultBoxSizeId) return;
    addItem(product.defaultBoxSizeId, 1);
    showToast(`${product.name} added to cart!`);
  }

  function toggleAlert(key: string) {
    setActiveAlerts((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <div
      className={`bg-surface border border-border-subtle rounded-2xl overflow-hidden shadow-brand-sm transition-opacity ${removing ? "opacity-40" : ""}`}
    >
      <Link href={`/product/${product.slug}`} className="block relative aspect-square bg-cream-warm group">
        {product.image && (
          <Image
            src={productImageSrc(product.image, 700)}
            alt={product.name}
            fill
            sizes="(max-width: 600px) 45vw, 220px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
      </Link>
      <div className="p-4">
        <Link href={`/product/${product.slug}`} className="font-serif font-bold hover:text-mango-orange">
          {product.name}
        </Link>
        <div className="flex items-baseline gap-1 my-1.5">
          {soldOut ? (
            <span className="text-sm text-ink-light">Currently unavailable</span>
          ) : (
            <span className="font-bold text-mango-orange tabular-nums">{formatPKR(product.minPrice!)}</span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {ALERT_TYPES.map((alert) => (
            <button
              key={alert.key}
              type="button"
              onClick={() => toggleAlert(alert.key)}
              aria-pressed={activeAlerts.has(alert.key)}
              title="Notification delivery is coming soon"
              className={`text-[0.65rem] font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                activeAlerts.has(alert.key)
                  ? "bg-mango-orange/10 border-mango-orange text-mango-orange"
                  : "border-border-subtle text-ink-light"
              }`}
            >
              🔔 {alert.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {!soldOut && (
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 bg-orchard-green text-white text-xs font-semibold py-2 rounded-full hover:-translate-y-0.5 transition-transform"
            >
              Add to Cart
            </button>
          )}
          <button
            type="button"
            onClick={handleRemove}
            disabled={removing}
            aria-label={`Remove ${product.name} from wishlist`}
            className="w-8 h-8 rounded-full border border-border-subtle flex items-center justify-center text-ink-light hover:border-error hover:text-error shrink-0"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
