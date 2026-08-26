"use client";

import { useState } from "react";
import { WishlistCard } from "@/components/account/wishlist-card";
import { EmptyState } from "@/components/account/empty-state";
import type { ProductWithBoxSizes } from "@/lib/queries/products";

export function WishlistGrid({
  initialProducts,
  userId,
}: {
  initialProducts: ProductWithBoxSizes[];
  userId: string;
}) {
  const [products, setProducts] = useState(initialProducts);

  function handleRemoved(productId: string) {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        }
        title="Your wishlist is empty"
        message="Tap the heart on any product to save it here and get notified about price drops and restocks."
        actionHref="/#shop"
        actionLabel="Browse Products"
      />
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {products.map((p) => (
        <WishlistCard key={p.id} product={p} userId={userId} onRemoved={handleRemoved} />
      ))}
    </div>
  );
}
