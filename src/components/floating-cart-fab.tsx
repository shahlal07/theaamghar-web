"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart-context";

const MAX_FILL_ITEMS = 5;

export function FloatingCartFab() {
  const { count, openCart } = useCart();
  const prevCount = useRef(count);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (count > prevCount.current) {
      setAnimating(true);
      const timeout = setTimeout(() => setAnimating(false), 650);
      prevCount.current = count;
      return () => clearTimeout(timeout);
    }
    prevCount.current = count;
  }, [count]);

  const fillPercent = Math.min(count, MAX_FILL_ITEMS) / MAX_FILL_ITEMS;

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Open cart${count > 0 ? `, ${count} item${count === 1 ? "" : "s"}` : ""}`}
      // Hidden on mobile: the bottom tab bar already has a Cart button with
      // its own count badge, so showing this too meant two cart entry points
      // and a 4-button tower climbing 250px+ up the right edge of a phone
      // screen. Desktop has no tab bar, so it stays there.
      className="hidden md:flex fixed bottom-[272px] md:bottom-[216px] right-5 z-40 w-14 h-14"
    >
      {/* Falling mango sits outside the clipped circle so the "pouring in from
          above" motion is actually visible, not cut off by the circle's edge. */}
      {animating && (
        <span
          className="absolute -top-3 left-1/2 -translate-x-1/2 text-base animate-[mangoFall_0.6s_ease-out] pointer-events-none"
          aria-hidden="true"
        >
          🥭
        </span>
      )}

      <span
        className={`relative w-14 h-14 rounded-full bg-surface border-2 shadow-brand-lg flex items-center justify-center overflow-hidden transition-colors ${
          count > 0 ? "border-mango-orange" : "border-border-subtle"
        } ${animating ? "animate-[bucketPulse_0.5s_ease]" : ""}`}
      >
        {/* Fill level -- caps visually at MAX_FILL_ITEMS so it never needs unbounded scaling */}
        {count > 0 && (
          <span
            className="absolute inset-x-0 bottom-0 bg-mango-orange/25 transition-[height] duration-500"
            style={{ height: `${fillPercent * 100}%` }}
            aria-hidden="true"
          />
        )}

        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="24"
          height="24"
          className={`relative z-10 ${count > 0 ? "text-mango-deep" : "text-ink-light"}`}
          aria-hidden="true"
        >
          <path d="M4 8h16l-1.5 10.5a2 2 0 0 1-2 1.5H7.5a2 2 0 0 1-2-1.5L4 8Z" />
          <path d="M8 8a4 4 0 0 1 8 0" />
        </svg>
      </span>

      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-mango-orange text-white text-[0.7rem] font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
