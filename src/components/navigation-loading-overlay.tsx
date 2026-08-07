"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

// Full-page "picking mangoes" loader shown while an internal page
// navigation is in flight. The App Router doesn't expose route-change
// start/end events, so this listens for genuine internal <a> clicks
// (skipping hash anchors, external links, new-tab clicks, mailto/tel, etc.)
// and clears itself once usePathname() reflects the new route.
export function NavigationLoadingOverlay() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      previousPathname.current = pathname;
      setLoading(false);
    }
  }, [pathname]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      // Note: don't bail out on e.defaultPrevented here -- next/link's own
      // onClick handler calls preventDefault() on every internal navigation
      // (that's how it swaps in client-side routing instead of a full page
      // load), so checking that flag would skip virtually every real link.
      // Handlers that preventDefault for non-navigation reasons in this app
      // (e.g. the product-card Compare/Wishlist/Quick-Add buttons) also call
      // stopPropagation(), so this document-level bubble listener never sees
      // those clicks at all -- no separate guard needed for them.
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      if (/^(mailto|tel|whatsapp):/i.test(href)) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      setLoading(true);
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Safety net so the overlay can never get stuck up forever.
  useEffect(() => {
    if (!loading) return;
    const timeout = setTimeout(() => setLoading(false), 8000);
    return () => clearTimeout(timeout);
  }, [loading]);

  if (!loading) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[2000] flex flex-col items-center justify-center gap-4 bg-cream/95 backdrop-blur-sm"
    >
      <div className="relative w-16 h-16 flex items-center justify-center">
        <span
          className="text-5xl"
          style={{ animation: "bucketPulse 1s ease-in-out infinite" }}
          aria-hidden="true"
        >
          🧺
        </span>
        <span
          className="absolute -top-7 text-3xl"
          style={{ animation: "mangoFall 0.9s ease-in-out infinite" }}
          aria-hidden="true"
        >
          🥭
        </span>
      </div>
      <p className="text-sm font-semibold text-ink-light">Picking your mangoes…</p>
    </div>
  );
}
