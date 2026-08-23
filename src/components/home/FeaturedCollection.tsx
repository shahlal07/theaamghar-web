"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Star, Plus } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useCompare } from "@/lib/compare-context";
import { useUser } from "@/lib/use-user";
import { useToast } from "@/lib/toast-context";
import { getWishlistedProductIds, toggleWishlist } from "@/lib/queries/wishlist";
import { productImageSrc } from "@/lib/product-image";
import { formatPKR } from "@/lib/format";
import type { ProductWithBoxSizes } from "@/lib/queries/products";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/contact-icons";
import { productOrderWhatsAppLink } from "@/lib/whatsapp";
import type { SiteContent } from "@/lib/queries/site-content";

export function FeaturedCollection({
  products,
  whatsappNumber,
  content,
}: {
  products: ProductWithBoxSizes[];
  whatsappNumber?: string | null;
  content: SiteContent["featuredCollection"];
}) {
  const featured = products.slice(0, 6);
  if (featured.length === 0) return null;

  return (
    <Section aria-label="Featured collection" className="bg-[var(--color-cream-warm)]">
      <Heading
        eyebrow={content.eyebrow}
        title={content.title}
        subtitle={content.subtitle}
        center
        className="mb-14"
      />
      {/* grid-cols-2 from the base breakpoint up -- this used to start at
          sm: (640px), so phones got a single column while every other
          product grid in the app (product-grid.tsx, wishlist-grid.tsx)
          already showed 2 across on mobile. Gap tightened on small screens
          to match. */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {featured.map((product, index) => (
          <FeaturedCard
            key={product.id}
            product={product}
            index={index}
            whatsappNumber={whatsappNumber}
          />
        ))}
      </div>
    </Section>
  );
}

function FeaturedCard({
  product,
  index,
  whatsappNumber,
}: {
  product: ProductWithBoxSizes;
  index: number;
  whatsappNumber?: string | null;
}) {
  const { addItem } = useCart();
  const { ids: compareIds, toggle: toggleCompare, isFull: compareIsFull } = useCompare();
  const { user } = useUser();
  const showToast = useToast();
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(false);
  const isComparing = compareIds.includes(product.id);
  const soldOut = !product.defaultBoxSizeId || product.minPrice === null;
  const size = product.boxSizes[0];

  useEffect(() => {
    if (!user) return;
    getWishlistedProductIds(user.id).then((ids) => setWishlisted(ids.has(product.id)));
  }, [user, product.id]);

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!product.defaultBoxSizeId) return;
    addItem(product.defaultBoxSizeId, 1, product.defaultUnitSource);
    showToast(`${product.name} added to cart!`);
  }

  function handleCompareToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!isComparing && compareIsFull) {
      showToast("You can compare up to 4 items at a time");
      return;
    }
    toggleCompare(product.id);
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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      whileHover={{ y: -8 }}
      className="group relative rounded-[24px] overflow-hidden bg-white shadow-[0_8px_30px_rgba(74,44,18,0.08)] hover:shadow-[0_24px_60px_rgba(74,44,18,0.18)] transition-shadow duration-500"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] bg-[var(--color-cream-warm)] overflow-hidden">
          {product.image && (
            <Image
              src={productImageSrc(product.image, 1000)}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 380px"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex flex-col gap-1.5 sm:gap-2 items-start max-w-[65%]">
            {product.isBestSeller && <Badge variant="gold">PREMIUM</Badge>}
            {product.isLimitedHarvest && <Badge variant="green">🍂 Limited</Badge>}
          </div>

          <button
            type="button"
            onClick={handleWishlist}
            aria-label={`${wishlisted ? "Remove" : "Add"} ${product.name} ${
              wishlisted ? "from" : "to"
            } wishlist`}
            aria-pressed={wishlisted}
            // 44px tap target on mobile, back to the original 36px on
            // desktop where a cursor (not a fingertip) is doing the clicking.
            className="absolute top-2 right-2 sm:top-4 sm:right-4 w-11 h-11 sm:w-9 sm:h-9 rounded-full bg-white/90 text-[var(--color-ink-fixed-dark)] flex items-center justify-center text-lg transition-transform hover:scale-110 active:scale-90"
          >
            {wishlisted ? "♥" : "♡"}
          </button>

          <button
            type="button"
            onClick={handleCompareToggle}
            aria-pressed={isComparing}
            title="Add to comparison"
            className={`absolute bottom-2 left-2 sm:bottom-4 sm:left-4 flex items-center gap-1 min-h-[36px] sm:min-h-0 text-[0.65rem] sm:text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-full transition-all active:scale-90 ${
              isComparing ? "bg-[var(--color-golden)] text-[var(--color-ink-fixed-dark)]" : "bg-white/90 text-[var(--color-ink-fixed-dark)]"
            }`}
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M9 3v18M15 3v18M4 8h1M4 16h1M19 8h1M19 16h1" />
            </svg>
            Compare
          </button>

          {!soldOut && (
            <button
              type="button"
              onClick={handleQuickAdd}
              className="absolute bottom-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1.5 bg-white text-[var(--color-ink-fixed-dark)] text-xs font-bold px-4 py-2.5 rounded-full shadow-lg hover:bg-[var(--color-golden)]"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
              Quick Add
            </button>
          )}
        </div>

        <div className="p-4 sm:p-6">
          {product.origin && (
            <div className="text-[0.65rem] sm:text-xs font-semibold tracking-wide uppercase text-[var(--color-orchard-green-text)] mb-1">
              {product.origin}
            </div>
          )}
          <h3 className="font-serif text-lg sm:text-2xl font-bold text-[var(--color-mango-deep-text)] truncate">{product.name}</h3>

          <div className="flex items-center gap-0.5 my-2 text-[var(--color-mango-deep-text)]" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="h-3.5 w-3.5"
                fill="currentColor"
                strokeWidth={0}
                style={{ opacity: i < Math.round(product.rating_avg) ? 1 : 0.25 }}
              />
            ))}
            {product.review_count > 0 && (
              <span className="text-xs text-[var(--color-ink)]/60 ml-1">({product.review_count})</span>
            )}
          </div>

          {product.sweetness && (
            <div className="inline-block text-xs font-medium text-[var(--color-orchard-green-text)] bg-[var(--color-orchard-green)]/8 rounded-full px-3 py-1 mb-3">
              Taste: {product.sweetness}
            </div>
          )}

          <div className="flex items-baseline justify-between mt-2">
            {soldOut ? (
              <span className="text-sm text-[var(--color-ink)]/60">Currently unavailable</span>
            ) : (
              <span className="font-bold text-lg text-[var(--color-mango-deep-text)]">
                {formatPKR(product.minPrice!)}
                {size && (
                  <span className="text-xs font-normal text-[var(--color-ink)]/60"> / {size.box_size_kg}kg</span>
                )}
              </span>
            )}
          </div>

          {whatsappNumber && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(
                  productOrderWhatsAppLink(whatsappNumber, product.name, size?.box_size_kg),
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
              className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-[#25D366]"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              Order via WhatsApp
            </button>
          )}
        </div>
      </Link>

      <div className="px-4 pb-4 sm:px-6 sm:pb-6">
        <Button href={`/product/${product.slug}`} variant="outline-dark" size="md" className="w-full">
          View Collection
        </Button>
      </div>
    </motion.div>
  );
}
