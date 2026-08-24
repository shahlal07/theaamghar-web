"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useCompare } from "@/lib/compare-context";
import { useUser } from "@/lib/use-user";
import { useToast } from "@/lib/toast-context";
import { getWishlistedProductIds, toggleWishlist } from "@/lib/queries/wishlist";
import { productImageSrc } from "@/lib/product-image";
import { formatPKR } from "@/lib/format";
import type { ProductWithBoxSizes } from "@/lib/queries/products";
import { starsHTML } from "@/lib/stars";
import { WhatsAppIcon } from "@/components/contact-icons";
import { productOrderWhatsAppLink } from "@/lib/whatsapp";

export function ProductCard({
  product,
  whatsappNumber,
  whatsappTemplate,
  paymentBadgeText,
}: {
  product: ProductWithBoxSizes;
  whatsappNumber?: string | null;
  whatsappTemplate?: string | null;
  paymentBadgeText?: string | null;
}) {
  const { addItem } = useCart();
  const { ids: compareIds, toggle: toggleCompare, isFull: compareIsFull } = useCompare();
  const { user } = useUser();
  const showToast = useToast();
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(false);
  const isComparing = compareIds.includes(product.id);

  function handleCompareToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!isComparing && compareIsFull) {
      showToast("You can compare up to 4 items at a time");
      return;
    }
    toggleCompare(product.id);
  }

  useEffect(() => {
    if (!user) return;
    getWishlistedProductIds(user.id).then((ids) => setWishlisted(ids.has(product.id)));
  }, [user, product.id]);

  const soldOut = !product.defaultBoxSizeId || product.minPrice === null;

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!product.defaultBoxSizeId) return;
    addItem(product.defaultBoxSizeId, 1, product.defaultUnitSource);
    showToast(`${product.name} added to cart!`);
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push("/login");
      return;
    }
    toggleWishlist(user.id, product.id, wishlisted);
    setWishlisted((v) => !v);
    showToast(wishlisted ? "Removed from wishlist" : "Added to wishlist!");
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block rounded-brand overflow-hidden bg-surface shadow-brand-sm hover:shadow-brand-md hover:-translate-y-1 transition-all"
    >
      <div className="relative aspect-square bg-cream-warm">
        {product.image && (
          <Image
            src={productImageSrc(product.image, 1000)}
            sizes="(max-width: 600px) 92vw, (max-width: 1024px) 45vw, 320px"
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <div className="absolute top-1.5 left-1.5 md:top-3 md:left-3 flex flex-col gap-1 md:gap-1.5 items-start max-w-[70%]">
          {paymentBadgeText && (
            <span className="bg-white/90 text-[#1A1A1A] text-[0.55rem] md:text-[0.7rem] font-semibold px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-full leading-tight">
              {paymentBadgeText}
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-golden text-mango-deep text-[0.55rem] md:text-[0.7rem] font-bold px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-full leading-tight">
              ⭐ Best Seller
            </span>
          )}
          {product.isLimitedHarvest && (
            <span className="bg-mango-orange text-white text-[0.55rem] md:text-[0.7rem] font-bold px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-full leading-tight">
              🍂 Limited Harvest
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleCompareToggle}
          aria-pressed={isComparing}
          title="Add to comparison"
          className={`absolute bottom-1.5 left-1.5 md:bottom-3 md:left-3 flex items-center gap-1 min-h-[44px] text-[0.65rem] md:text-[0.7rem] font-semibold px-3 py-2 md:px-2.5 md:py-1.5 md:min-h-0 rounded-full transition-all active:scale-90 ${
            isComparing ? "bg-mango-orange text-white" : "bg-white/90 text-[#1A1A1A]"
          }`}
        >
          <svg className="w-2.5 h-2.5 md:w-3 md:h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M9 3v18M15 3v18M4 8h1M4 16h1M19 8h1M19 16h1" />
          </svg>
          Compare
        </button>
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={`${wishlisted ? "Remove" : "Add"} ${product.name} ${
            wishlisted ? "from" : "to"
          } wishlist`}
          aria-pressed={wishlisted}
          className="absolute top-1.5 right-1.5 md:top-3 md:right-3 w-11 h-11 md:w-9 md:h-9 rounded-full bg-white/90 text-[#1A1A1A] flex items-center justify-center text-lg transition-transform hover:scale-110 active:scale-90"
        >
          {wishlisted ? "♥" : "♡"}
        </button>
        {!soldOut && (
          <button
            type="button"
            onClick={handleQuickAdd}
            className="absolute bottom-1.5 right-1.5 md:bottom-3 md:right-3 flex items-center justify-center gap-1 md:gap-1.5 bg-white text-[#1A1A1A] text-[0.65rem] md:text-xs font-semibold min-w-[44px] min-h-[44px] px-3 py-2 md:min-w-0 md:min-h-0 md:px-3 md:py-2 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all hover:scale-105 active:scale-90"
          >
            <svg className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span className="hidden md:inline">Quick Add</span>
          </button>
        )}
      </div>
      <div className="p-4">
        {product.origin && (
          <div className="text-xs text-ink-light mb-1">{product.origin}</div>
        )}
        <h3 className="font-serif font-bold text-lg">{product.name}</h3>
        <div
          className="text-mango-orange text-sm my-1"
          dangerouslySetInnerHTML={{ __html: starsHTML(product.rating_avg) }}
        />
        <div className="flex items-baseline gap-1">
          {soldOut ? (
            <span className="text-sm text-ink-light">Currently unavailable</span>
          ) : (
            <>
              <span className="font-bold text-mango-orange">
                {formatPKR(product.minPrice!)}
              </span>
              {product.boxSizes[0] && (
                <span className="text-xs text-ink-light">
                  / {product.boxSizes[0].box_size_kg}kg
                </span>
              )}
            </>
          )}
        </div>
        {whatsappNumber && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(
                productOrderWhatsAppLink(whatsappNumber, product.name, product.boxSizes[0]?.box_size_kg, whatsappTemplate),
                "_blank",
                "noopener,noreferrer"
              );
            }}
            // Was a bare 16px-tall text row -- the smallest tap target on the
            // card despite being a real conversion path for this business.
            className="mt-1 -ml-1 flex items-center gap-1.5 min-h-[44px] md:min-h-0 px-1 md:px-0 md:mt-2 text-xs font-semibold text-[#25D366]"
          >
            <WhatsAppIcon className="w-4 h-4 md:w-3.5 md:h-3.5" />
            Order via WhatsApp
          </button>
        )}
      </div>
    </Link>
  );
}
