"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { NashemannLoader } from "@/components/nashemann-loader";

// Full-page loader shown while an internal page navigation is in flight,
// reusing the same Nashemann-branded overlay as app/loading.tsx (App
// Router's own Suspense fallback only fires once a route segment actually
// suspends, which for a fast client-cached navigation may never show at
// all -- this fires immediately on the click instead, for instant
// feedback, then clears once usePathname() reflects the new route). The
// App Router doesn't expose route-change start/end events, so this
// listens for genuine internal <a> clicks (skipping hash anchors,
// external links, new-tab clicks, mailto/tel, etc.) directly.
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

  return <NashemannLoader />;
}
