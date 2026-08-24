"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useUser } from "@/lib/use-user";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationBell } from "@/components/notification-bell";
import type { SiteContent } from "@/lib/queries/site-content";

export function Navbar({ brand }: { brand: SiteContent["brand"] }) {
  const { count, openCart } = useCart();
  const { user } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const firstName = user?.user_metadata?.name?.split(" ")[0] ?? null;

  // Every link in the collapsible mobile menu needs this, or the drawer
  // stays open (rendered on top of, "in the background of", whatever page
  // the tap just navigated to) since Navbar is a persistent client
  // component that doesn't remount on route change.
  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-cream/90 backdrop-blur-xl shadow-brand-sm px-[5%] py-4 flex items-center justify-between">
      <Link
        href="/"
        className="font-serif text-2xl font-bold text-ink flex items-center gap-2"
      >
        {brand.logoImageUrl ? (
          // Vendor-uploaded logo art commonly has its own circular mark
          // inset with padding/background inside the source frame (Mina
          // Cafe's does), so a plain object-cover at the container's exact
          // aspect leaves a sliver of that background visible at the
          // rounded-full clip edge instead of the mark filling it. Scaling
          // the image up within a clipped, fixed-size wrapper crops that
          // margin away so the mark itself fills the circle edge-to-edge.
          <span className="relative inline-block w-7 h-7 shrink-0 overflow-hidden rounded-full">
            <Image
              src={brand.logoImageUrl}
              alt={brand.logoText}
              fill
              sizes="28px"
              className="scale-125 object-cover"
            />
          </span>
        ) : (
          <span
            aria-hidden="true"
            className="w-7 h-7 bg-mango-orange inline-block rounded-[50%_50%_50%_5px]"
          />
        )}
        {brand.logoText}
      </Link>

      <div
        className={`${
          menuOpen ? "flex" : "hidden"
        } md:flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 absolute md:static top-full left-0 right-0 md:top-auto bg-cream md:bg-transparent p-6 md:p-0 shadow-brand-md md:shadow-none`}
      >
        <Link href="/products" onClick={closeMenu} className="text-sm font-medium hover:text-mango-orange">
          Shop
        </Link>
        <Link href="/#story" onClick={closeMenu} className="text-sm font-medium hover:text-mango-orange">
          Our Story
        </Link>
        <Link href="/contact" onClick={closeMenu} className="text-sm font-medium hover:text-mango-orange">
          Contact
        </Link>
        <Link href="/track" onClick={closeMenu} className="text-sm font-medium hover:text-mango-orange">
          Track Order
        </Link>
        <Link href="/wishlist" onClick={closeMenu} className="text-sm font-medium hover:text-mango-orange">
          Wishlist
        </Link>
        <Link
          href={user ? "/account" : "/login"}
          onClick={closeMenu}
          className="text-sm font-medium hover:text-mango-orange"
        >
          {firstName ? `Hi, ${firstName}` : "Sign In"}
        </Link>

        <div className="flex items-center gap-3">
          {/* Desktop-only: the mobile versions of these live in the
              always-visible cluster below so they aren't buried behind the
              hamburger. */}
          <span className="hidden md:inline-flex">
            <NotificationBell />
          </span>
          <span className="hidden md:inline-flex">
            <ThemeToggle />
          </span>
          <button
            type="button"
            onClick={() => {
              closeMenu();
              openCart();
            }}
            aria-label="Open cart"
            className="relative flex items-center gap-2 bg-orchard-green text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-[0_4px_15px_rgba(45,90,39,0.3)] hover:-translate-y-0.5 transition-transform"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            Cart
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-mango-orange text-white text-[0.7rem] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Always-visible right cluster. The bell/theme toggle live OUTSIDE
          the collapsible menu above so they stay reachable on mobile
          without opening the hamburger. */}
      <div className="flex items-center gap-1 md:hidden">
        <NotificationBell />
        <ThemeToggle />
        <button
          type="button"
          className="flex flex-col gap-1.5 p-2 min-w-[44px] min-h-[44px] items-center justify-center"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="w-6 h-0.5 bg-ink" />
          <span className="w-6 h-0.5 bg-ink" />
          <span className="w-6 h-0.5 bg-ink" />
        </button>
      </div>
    </nav>
  );
}
