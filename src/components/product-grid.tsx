"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { generalInquiryWhatsAppLink } from "@/lib/whatsapp";
import type { ProductWithBoxSizes } from "@/lib/queries/products";

type SortOption = "recommended" | "price-asc" | "price-desc" | "newest";

export function ProductGrid({
  products,
  whatsappNumber,
}: {
  products: ProductWithBoxSizes[];
  whatsappNumber?: string | null;
}) {
  const [query, setQuery] = useState("");
  const [sweetness, setSweetness] = useState<string | null>(null);
  const [fiber, setFiber] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>("recommended");

  const prices = products.map((p) => p.minPrice).filter((p): p is number => p !== null);
  const maxCatalogPrice = prices.length > 0 ? Math.max(...prices) : 0;
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const effectiveMaxPrice = maxPrice ?? maxCatalogPrice;

  const sweetnessOptions = useMemo(
    () => [...new Set(products.map((p) => p.sweetness).filter((s): s is string => Boolean(s)))],
    [products]
  );
  const fiberOptions = useMemo(
    () => [...new Set(products.map((p) => p.fiber).filter((f): f is string => Boolean(f)))],
    [products]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = products.filter((p) => {
      if (q) {
        const haystack = `${p.name} ${p.tagline ?? ""} ${p.origin ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (sweetness && p.sweetness !== sweetness) return false;
      if (fiber && p.fiber !== fiber) return false;
      if (p.minPrice !== null && p.minPrice > effectiveMaxPrice) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return (a.minPrice ?? Infinity) - (b.minPrice ?? Infinity);
        case "price-desc":
          return (b.minPrice ?? -Infinity) - (a.minPrice ?? -Infinity);
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return b.rating_avg - a.rating_avg;
      }
    });

    return result;
  }, [products, query, sweetness, fiber, effectiveMaxPrice, sort]);

  const hasActiveFilters = query || sweetness || fiber || maxPrice !== null;

  // Zero-result fallback only -- the instant local filter above stays the
  // primary search behavior. Debounced so it doesn't fire an AI call per
  // keystroke, and only when the query itself (not the other filters) is
  // what's producing no matches.
  const [aiReply, setAiReply] = useState<string | null>(null);
  const [aiPending, setAiPending] = useState(false);
  const [aiUnavailable, setAiUnavailable] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2 || filtered.length > 0) {
      // Deferred to a microtask so this is a callback response to the
      // "query/results changed" condition, not a synchronous setState during
      // the effect's commit -- same pattern used in checkout-form.tsx for
      // the equivalent "reset when a condition no longer holds" case.
      Promise.resolve().then(() => {
        setAiReply(null);
        setAiPending(false);
        setAiUnavailable(false);
      });
      return;
    }

    Promise.resolve().then(() => {
      setAiPending(true);
      setAiUnavailable(false);
    });
    const timeout = setTimeout(() => {
      fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: trimmed }],
          context: "search",
        }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) {
            if (res.status === 503) setAiUnavailable(true);
            setAiReply(data.error ?? null);
            return;
          }
          setAiReply(data.reply ?? null);
        })
        .catch(() => setAiReply("Something went wrong. Please try again or message us on WhatsApp."))
        .finally(() => setAiPending(false));
    }, 600);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filtered.length]);

  function clearFilters() {
    setQuery("");
    setSweetness(null);
    setFiber(null);
    setMaxPrice(null);
    setSort("recommended");
  }

  return (
    <div>
      <div className="flex flex-col gap-4 mb-8">
        <div className="relative max-w-md mx-auto w-full">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-light"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search mangoes by name, origin…"
            aria-label="Search mangoes"
            className="w-full border border-border-subtle rounded-full pl-10 pr-4 py-2.5 text-sm bg-surface"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
          {sweetnessOptions.length > 1 && (
            <FilterSelect
              label="Sweetness"
              value={sweetness}
              options={sweetnessOptions}
              onChange={setSweetness}
            />
          )}
          {fiberOptions.length > 1 && (
            <FilterSelect label="Fibre" value={fiber} options={fiberOptions} onChange={setFiber} />
          )}
          {maxCatalogPrice > 0 && (
            <label className="flex items-center gap-2 text-ink-light">
              Up to Rs {(maxPrice ?? maxCatalogPrice).toLocaleString("en-PK")}
              <input
                type="range"
                min={0}
                max={maxCatalogPrice}
                step={100}
                value={effectiveMaxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="accent-mango-orange w-28"
                aria-label="Maximum price"
              />
            </label>
          )}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            aria-label="Sort by"
            className="border border-border-subtle rounded-full px-3 py-1.5 bg-surface text-ink-light"
          >
            <option value="recommended">Recommended</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-mango-orange font-semibold"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-10 max-w-md mx-auto">
          <p className="text-ink-light mb-4">
            No mangoes match your search — try adjusting the filters.
          </p>
          {query.trim().length >= 2 && (aiPending || aiReply) && (
            <div className="bg-cream-warm rounded-brand p-4 text-left text-sm">
              <div className="font-semibold text-xs text-mango-orange uppercase tracking-wide mb-1">
                🥭 AI Assistant
              </div>
              {aiPending ? (
                <p className="text-ink-light">Thinking…</p>
              ) : (
                <>
                  <p className="text-ink">{aiReply}</p>
                  {aiUnavailable && whatsappNumber && (
                    <a
                      href={generalInquiryWhatsAppLink(whatsappNumber)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-xs font-semibold text-mango-orange underline"
                    >
                      Chat with us on WhatsApp instead →
                    </a>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} whatsappNumber={whatsappNumber} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string | null;
  options: string[];
  onChange: (value: string | null) => void;
}) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || null)}
      aria-label={label}
      className="border border-border-subtle rounded-full px-3 py-1.5 bg-surface text-ink-light"
    >
      <option value="">{label}: Any</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
