"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { resolveCartLines, type CartLine } from "@/lib/queries/cart";
import { getFreeShippingThreshold } from "@/lib/queries/shipping";
import { productImageSrc } from "@/lib/product-image";
import { formatPKR } from "@/lib/format";
import { RecentlyViewedStrip } from "@/components/recently-viewed-strip";
import { BoughtTogetherStrip } from "@/components/bought-together-strip";
import type { SiteContent } from "@/lib/queries/site-content";
import { ShoppingBag } from "lucide-react";

export function CartSidebar({ content }: { content: SiteContent["emptyStates"] }) {
  const { items, isOpen, closeCart, closeCartForNavigation, updateQty, removeItem } = useCart();
  const [lines, setLines] = useState<CartLine[] | null>(null);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number | null>(null);

  const vendorId = lines?.[0]?.vendorId;
  useEffect(() => {
    if (!vendorId) return;
    getFreeShippingThreshold(vendorId).then(setFreeShippingThreshold);
  }, [vendorId]);

  // Stale-while-revalidate rather than resetting to a loading state on
  // every change: reopening a cart that's already resolved shows the last
  // known lines immediately instead of flashing "Loading…", and prices/
  // stock still refresh in the background against Supabase.
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    resolveCartLines(items).then((resolved) => {
      if (!cancelled) setLines(resolved);
    });
    return () => {
      cancelled = true;
    };
  }, [isOpen, items]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeCart();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeCart]);

  const subtotal = lines?.reduce((sum, l) => sum + l.lineTotal, 0) ?? 0;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-[1100] transition-opacity ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed top-0 right-0 h-full w-full max-w-[min(24rem,100vw)] bg-surface z-[1101] shadow-brand-lg flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-border-subtle">
          <h3 className="font-serif text-xl font-bold">Your Basket</h3>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {lines === null ? (
            <p className="text-ink-light text-sm">Loading…</p>
          ) : lines.length === 0 ? (
            <div>
              <div className="text-center py-10">
                <ShoppingBag className="h-10 w-10 mx-auto mb-3 text-[var(--color-ink-light)]" strokeWidth={1.5} aria-hidden="true" />
                <p>{content.cartTitle}</p>
                <p className="text-sm text-ink-light mt-2">{content.cartSubtitle}</p>
              </div>
              <RecentlyViewedStrip />
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {lines.map((line) => (
                <div key={line.unitId} className="flex gap-3 pb-5 border-b border-border-subtle last:border-b-0 last:pb-0">
                  {line.image && (
                    <Image
                      src={productImageSrc(line.image, 400)}
                      alt=""
                      width={80}
                      height={80}
                      className="rounded-xl object-cover w-16 h-16 shrink-0"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{line.name}</div>
                    <div className="text-xs text-ink-light mb-1.5">
                      {line.source === "box_size" ? `${line.label} box` : line.label}
                      {line.addonLabel && ` + ${line.addonLabel}`}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 border-[1.5px] border-border-subtle rounded-full px-3 py-1">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${line.name}`}
                          onClick={() => updateQty(line.unitId, line.qty - 1)}
                          className="text-sm leading-none w-3 text-center"
                        >
                          −
                        </button>
                        <span className="text-xs w-3 text-center tabular-nums">{line.qty}</span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${line.name}`}
                          onClick={() => updateQty(line.unitId, line.qty + 1)}
                          disabled={line.qty >= line.stockQty}
                          className="text-sm leading-none w-3 text-center disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>
                      <div className="font-bold text-mango-orange text-sm tabular-nums">
                        {formatPKR(line.lineTotal)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(line.unitId)}
                      className="text-xs text-ink-light hover:text-mango-deep transition-colors mt-1.5"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <BoughtTogetherStrip
                vendorId={lines[0]?.vendorId ?? null}
                excludeProductIds={lines.map((l) => l.productId)}
              />
              <RecentlyViewedStrip />
            </div>
          )}
        </div>

        {lines !== null && lines.length > 0 && (
          <div className="p-5 border-t border-border-subtle bg-cream-warm">
            {freeShippingThreshold !== null && (
              <div className="mb-4">
                {subtotal >= freeShippingThreshold ? (
                  <p className="text-xs font-semibold text-orchard-green mb-2">
                    🎉 You&apos;ve unlocked free shipping!
                  </p>
                ) : (
                  <p className="text-xs text-ink-light mb-2">
                    Add {formatPKR(freeShippingThreshold - subtotal)} more for free shipping
                  </p>
                )}
                <div className="h-1.5 rounded-full bg-surface overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-mango-orange to-golden rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            )}
            <div className="flex justify-between text-sm font-semibold mb-1 tabular-nums">
              <span className="font-normal text-ink-light">Subtotal</span>
              <span>{formatPKR(subtotal)}</span>
            </div>
            <p className="text-xs text-ink-light mb-1">
              Shipping calculated at checkout
            </p>
            <p className="text-xs text-ink-light mb-4">
              🚚 Usually delivered within 24–48 hours of dispatch
            </p>
            <Link
              href="/checkout"
              onClick={closeCartForNavigation}
              className="block text-center bg-mango-orange text-white font-semibold py-3.5 rounded-full hover:bg-mango-deep hover:-translate-y-0.5 transition-all"
            >
              Proceed to Checkout →
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
