"use client";

import Link from "next/link";
import Image from "next/image";
import { productImageSrc } from "@/lib/product-image";
import { formatPKR } from "@/lib/format";
import { useCart } from "@/lib/cart-context";

type MiniProduct = {
  id: string;
  slug: string;
  name: string;
  image: string | null;
  price: number | null;
  discount_price?: number | null;
};

export function MiniProductCard({ product }: { product: MiniProduct }) {
  // price is derived (cheapest active box size/variant) and null only for a
  // product with no active offering yet -- rare, but real once product
  // types can have zero variants mid-setup.
  const price = product.discount_price ?? product.price;
  // This card is reused inside the cart sidebar's "Recently Viewed" list
  // (shown even when the cart is empty). Without this, tapping a product
  // there navigated the page underneath while the sidebar stayed open on
  // top of it. closeCart() is a no-op when the cart isn't open, so this is
  // safe everywhere else this card is used (wishlist, recommendations).
  const { closeCart } = useCart();
  return (
    <Link
      href={`/product/${product.slug}`}
      onClick={closeCart}
      className="group flex flex-col rounded-brand-sm overflow-hidden border border-border-subtle hover:shadow-brand-sm transition-shadow bg-surface"
    >
      <div className="relative aspect-square bg-cream-warm">
        {product.image && (
          <Image
            src={productImageSrc(product.image, 400)}
            alt={product.name}
            fill
            sizes="200px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
      </div>
      <div className="p-3">
        <div className="text-sm font-semibold truncate">{product.name}</div>
        {price !== null && (
          <div className="text-xs text-mango-orange font-bold">{formatPKR(price)}</div>
        )}
      </div>
    </Link>
  );
}
