"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useUser } from "@/lib/use-user";
import { useToast } from "@/lib/toast-context";
import { getWishlistedProductIds, toggleWishlist } from "@/lib/queries/wishlist";
import { productImageSrc } from "@/lib/product-image";
import { formatPKR } from "@/lib/format";
import { trackProductView } from "@/lib/recently-viewed";
import { WhatsAppIcon } from "@/components/contact-icons";
import { productOrderWhatsAppLink } from "@/lib/whatsapp";
import { priceForSelection, type AddonGroup } from "@/lib/product-addons";

type BoxSize = {
  id: string;
  box_size_kg: number;
  selling_price: number;
  stock_qty: number;
};

type Variant = {
  id: string;
  attributes: Record<string, string>;
  label: string | null;
  selling_price: number;
  stock_qty: number;
};

export function ProductPurchasePanel({
  productId,
  productSlug,
  productName,
  images,
  boxSizes,
  variants = [],
  whatsappNumber,
  addonGroups = [],
}: {
  productId: string;
  productSlug: string;
  productName: string;
  images: string[];
  boxSizes: BoxSize[];
  variants?: Variant[];
  whatsappNumber?: string | null;
  addonGroups?: AddonGroup[];
}) {
  const { addItem } = useCart();
  const { user } = useUser();
  const router = useRouter();
  const [selectedAddons, setSelectedAddons] = useState<Record<string, string[]>>({});

  function toggleAddon(groupId: string, optionId: string) {
    setSelectedAddons((prev) => {
      const current = prev[groupId] ?? [];
      const next = current.includes(optionId) ? current.filter((id) => id !== optionId) : [...current, optionId];
      return { ...prev, [groupId]: next };
    });
  }
  const showToast = useToast();

  // Fast path: any product with real box sizes (i.e. every product today,
  // and every future fruit product) renders the exact same fieldset/state/
  // JSX this component always has -- zero behavioral change for the live
  // catalog. Only a product with variants and no box sizes (non-fruit)
  // takes the generalized multi-fieldset path below.
  const isFruit = boxSizes.length > 0;

  const [activeImage, setActiveImage] = useState(images[0] ?? null);
  const [selectedBoxSizeId, setSelectedBoxSizeId] = useState(
    boxSizes.find((b) => b.stock_qty > 0)?.id ?? boxSizes[0]?.id ?? null
  );

  // Union of every attribute key across all variants, in first-seen order
  // (e.g. ["size", "color"]) -- drives how many fieldsets render.
  const dimensionKeys = useMemo(() => {
    const keys: string[] = [];
    for (const v of variants) {
      for (const k of Object.keys(v.attributes)) {
        if (!keys.includes(k)) keys.push(k);
      }
    }
    return keys;
  }, [variants]);

  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>(() => {
    const firstInStock = variants.find((v) => v.stock_qty > 0) ?? variants[0];
    return firstInStock ? { ...firstInStock.attributes } : {};
  });

  // MVP: exact-match resolution over currently selected attributes, not a
  // full combination matrix (e.g. it won't grey out a Color that has no
  // matching Size) -- a deliberate scope cut, not an oversight.
  const selectedVariant =
    variants.find((v) => dimensionKeys.every((k) => v.attributes[k] === selectedAttrs[k])) ?? null;

  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const panelEndRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Subtle CSS-only 3D tilt toward the cursor — pure transform on an
  // existing ref, no re-render, no extra assets, so it stays cheap on
  // mobile. Mirrors the tilt-to-inspect motif used across the site.
  function handleStageMove(e: React.PointerEvent<HTMLDivElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    const rx = Math.max(-6, Math.min(6, px * 10));
    const ry = Math.max(-5, Math.min(5, -py * 8));
    el.style.transform = `perspective(1200px) rotateX(${ry}deg) rotateY(${rx}deg)`;
  }
  function handleStageLeave() {
    const el = stageRef.current;
    if (el) el.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg)";
  }

  useEffect(() => {
    if (!user) return;
    getWishlistedProductIds(user.id).then((ids) => setWishlisted(ids.has(productId)));
  }, [user, productId]);

  useEffect(() => {
    trackProductView(productSlug);
  }, [productSlug]);

  // Sticky mobile add-to-cart bar appears once the main buy panel scrolls
  // out of view, so the primary action stays reachable without hunting for
  // it while reading the description/reviews further down the page.
  useEffect(() => {
    const el = panelEndRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setShowStickyBar(!entry.isIntersecting), {
      rootMargin: "-64px 0px 0px 0px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const selectedBoxSize = boxSizes.find((b) => b.id === selectedBoxSizeId) ?? null;
  const selectedUnit = isFruit ? selectedBoxSize : selectedVariant;
  const inStock = (selectedUnit?.stock_qty ?? 0) > 0;
  const maxQty = Math.min(selectedUnit?.stock_qty ?? 0, 20);

  function handleAddToCart() {
    if (!selectedUnit) return;
    addItem(selectedUnit.id, qty, isFruit ? "box_size" : "variant", addonGroups.length > 0 ? selectedAddons : undefined);
    showToast(`${productName} added to cart!`);
  }

  // Buy Now skips the cart entirely (see checkout's buynow= flow), which has
  // no way to carry an addon selection through the URL/resolution path yet
  // -- a product with add-ons only offers Add to Cart, where they're fully
  // supported, rather than silently dropping the topping choice on Buy Now.
  const hasAddons = addonGroups.length > 0;

  function handleBuyNow() {
    if (!selectedUnit) return;
    router.push(
      `/checkout?buynow=${selectedUnit.id}&buynowSource=${isFruit ? "box_size" : "variant"}&qty=${qty}`
    );
  }

  function handleWishlist() {
    if (!user) {
      router.push("/login");
      return;
    }
    toggleWishlist(user.id, productId, wishlisted);
    setWishlisted((v) => !v);
    showToast(wishlisted ? "Removed from wishlist" : "Added to wishlist!");
  }

  return (
    <div className="grid md:grid-cols-2 gap-10">
      <div>
        <div
          ref={stageRef}
          onPointerMove={handleStageMove}
          onPointerLeave={handleStageLeave}
          style={{ transition: "transform 0.35s cubic-bezier(.22,1,.36,1)" }}
          className="relative aspect-square rounded-brand overflow-hidden bg-cream-warm shadow-brand-lg"
        >
          {activeImage && (
            <Image
              src={productImageSrc(activeImage, 1000)}
              alt={productName}
              fill
              priority
              className="object-cover"
            />
          )}
        </div>
        {images.length > 1 && (
          <div className="flex gap-3 mt-4">
            {images.map((img) => (
              <button
                key={img}
                type="button"
                onClick={() => setActiveImage(img)}
                className={`relative w-16 h-16 rounded-xl overflow-hidden ring-2 transition-all ${
                  activeImage === img ? "ring-mango-orange" : "ring-transparent hover:ring-border-subtle"
                }`}
              >
                <Image src={productImageSrc(img, 400)} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        {isFruit ? (
          <fieldset className="mb-6">
            <legend className="text-xs font-semibold uppercase tracking-wide text-ink-light mb-3">
              Box Size
            </legend>
            <div className="flex flex-wrap gap-2.5">
              {boxSizes.map((b) => (
                <label
                  key={b.id}
                  className={`cursor-pointer border-[1.5px] rounded-full px-5 py-2.5 text-sm transition-colors ${
                    selectedBoxSizeId === b.id
                      ? "border-mango-orange bg-mango-orange/8 text-mango-deep"
                      : "border-border-subtle hover:border-mango-orange/40"
                  } ${b.stock_qty === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  <input
                    type="radio"
                    name="boxSize"
                    value={b.id}
                    checked={selectedBoxSizeId === b.id}
                    disabled={b.stock_qty === 0}
                    onChange={() => {
                      setSelectedBoxSizeId(b.id);
                      setQty(1);
                    }}
                    className="sr-only"
                  />
                  <span className="font-semibold">{b.box_size_kg}kg</span>
                  <span className="mx-1.5 opacity-40">·</span>
                  <span className="font-semibold">{formatPKR(b.selling_price)}</span>
                  {b.stock_qty === 0 && <span className="text-xs ml-1.5">(out of stock)</span>}
                </label>
              ))}
            </div>
          </fieldset>
        ) : (
          dimensionKeys.map((dimKey) => {
            const values = [...new Set(variants.map((v) => v.attributes[dimKey]).filter(Boolean))];
            return (
              <fieldset key={dimKey} className="mb-6">
                <legend className="text-xs font-semibold uppercase tracking-wide text-ink-light mb-3 capitalize">
                  {dimKey}
                </legend>
                <div className="flex flex-wrap gap-2.5">
                  {values.map((value) => {
                    const isSelected = selectedAttrs[dimKey] === value;
                    // Whether picking this value could resolve to any
                    // in-stock variant, given the OTHER dimensions' current
                    // selections -- purely a visual disabled hint, not a
                    // hard block (this is the "filter, not full matrix" MVP).
                    const hasStock = variants.some(
                      (v) =>
                        v.attributes[dimKey] === value &&
                        dimensionKeys.every((k) => k === dimKey || v.attributes[k] === selectedAttrs[k]) &&
                        v.stock_qty > 0
                    );
                    return (
                      <label
                        key={value}
                        className={`cursor-pointer border-[1.5px] rounded-full px-5 py-2.5 text-sm transition-colors ${
                          isSelected
                            ? "border-mango-orange bg-mango-orange/8 text-mango-deep"
                            : "border-border-subtle hover:border-mango-orange/40"
                        } ${!hasStock ? "opacity-40" : ""}`}
                      >
                        <input
                          type="radio"
                          name={dimKey}
                          value={value}
                          checked={isSelected}
                          onChange={() => {
                            setSelectedAttrs((a) => ({ ...a, [dimKey]: value }));
                            setQty(1);
                          }}
                          className="sr-only"
                        />
                        <span className="font-semibold">{value}</span>
                        {!hasStock && <span className="text-xs ml-1.5">(out of stock)</span>}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            );
          })
        )}

        {/* Fruit shows price inline on each box-size pill, so the customer
            already sees it while choosing -- a variant's price depends on
            the full attribute combination, not one dimension's value, so it
            can't live on a single pill the same way. Shown explicitly here
            instead, since the sticky price bar below is mobile-only. */}
        {!isFruit && selectedVariant && (
          <p className="text-2xl font-bold text-mango-orange mb-4">{formatPKR(selectedVariant.selling_price)}</p>
        )}

        {inStock ? (
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-light">
              Quantity
            </span>
            <div className="flex items-center gap-4 border-[1.5px] border-border-subtle rounded-full px-4 py-1.5">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="text-lg leading-none w-4 text-center"
              >
                −
              </button>
              <span className="w-5 text-center text-sm font-semibold tabular-nums">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                disabled={qty >= maxQty}
                className="text-lg leading-none w-4 text-center disabled:opacity-40"
              >
                +
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-error mb-6">This option is currently out of stock.</p>
        )}

        {addonGroups.map((group) => {
          const selected = selectedAddons[group.id] ?? [];
          const addonPrice = priceForSelection(group, selected.length);
          return (
            <fieldset key={group.id} className="mb-6">
              <legend className="text-xs font-semibold uppercase tracking-wide text-ink-light mb-3">
                {group.name} (optional)
              </legend>
              <div className="flex flex-wrap gap-3">
                {group.options.map((option) => {
                  const checked = selected.includes(option.id);
                  return (
                    <label key={option.id} className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAddon(group.id, option.id)}
                        className="w-4 h-4 accent-mango-orange"
                      />
                      {option.image && (
                        <span className="relative block h-8 w-8 shrink-0 overflow-hidden rounded-md border border-border-subtle">
                          <Image src={productImageSrc(option.image, 96)} alt="" fill sizes="32px" className="object-cover" />
                        </span>
                      )}
                      {option.label}
                    </label>
                  );
                })}
              </div>
              {group.note && <p className="text-xs text-ink-light mt-2">{group.note}</p>}
              {addonPrice > 0 && (
                <p className="text-xs font-semibold text-mango-orange mt-1">+ {formatPKR(addonPrice)}</p>
              )}
            </fieldset>
          );
        })}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!inStock}
            className="flex-1 bg-orchard-green text-white font-semibold py-3.5 rounded-full transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            Add to Cart
          </button>
          {!hasAddons && (
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={!inStock}
              className="flex-1 bg-mango-orange text-white font-semibold py-3.5 rounded-full transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              Buy Now
            </button>
          )}
          <button
            type="button"
            onClick={handleWishlist}
            aria-label={`${wishlisted ? "Remove" : "Add"} ${productName} ${wishlisted ? "from" : "to"} wishlist`}
            aria-pressed={wishlisted}
            className="w-14 h-14 rounded-full border-[1.5px] border-border-subtle flex items-center justify-center text-xl shrink-0 transition-colors hover:border-mango-orange"
          >
            {wishlisted ? "♥" : "♡"}
          </button>
        </div>
        {whatsappNumber && (
          <a
            href={productOrderWhatsAppLink(
              whatsappNumber,
              productName,
              isFruit ? selectedBoxSize?.box_size_kg : undefined
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 border-[1.5px] border-[#25D366] text-[#25D366] font-semibold py-3 rounded-full text-sm hover:bg-[#25D366]/5 transition-colors"
          >
            <WhatsAppIcon className="w-4.5 h-4.5" />
            Order Quickly via WhatsApp
          </a>
        )}
        <div ref={panelEndRef} />
      </div>

      {showStickyBar && (
        <div className="md:hidden fixed bottom-16 inset-x-0 z-[1000] bg-surface border-t border-border-subtle shadow-brand-lg p-3 flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold truncate">{productName}</div>
            {selectedUnit && (
              <div className="text-mango-orange font-bold text-sm">
                {formatPKR(selectedUnit.selling_price)}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!inStock}
            className="bg-orchard-green text-white font-semibold px-6 py-2.5 rounded-full text-sm disabled:opacity-50 shrink-0"
          >
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
}
