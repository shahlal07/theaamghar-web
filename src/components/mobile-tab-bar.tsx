"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useUser } from "@/lib/use-user";
import { useKeyboardOpen } from "@/lib/use-keyboard-open";

// /chat has its own bottom input bar (same reasoning as checkout/login/signup
// already being focused, single-purpose flows) -- the tab bar would overlap it.
// Exported so main-content.tsx's <main> padding can match exactly -- see
// that file's comment for why the two need to stay in sync.
export const EXCLUDED_PREFIXES = ["/checkout", "/login", "/signup", "/chat"];

export function MobileTabBar() {
  const pathname = usePathname();
  const { count, openCart } = useCart();
  const { user } = useUser();
  const keyboardOpen = useKeyboardOpen();

  if (EXCLUDED_PREFIXES.some((p) => pathname.startsWith(p))) return null;
  // Otherwise this fixed bar gets dragged up and sandwiched right above the
  // keyboard when a text field is focused (Android's interactive-widget=
  // resizes-content, needed so /chat's dvh sizing keeps its own input above
  // the keyboard, also shrinks the layout viewport everywhere else -- so a
  // `fixed bottom-0` element recalculates its position against the new,
  // smaller viewport instead of staying at the real screen edge). Hiding
  // it while the keyboard is open is simpler and more robust than trying to
  // keep it pinned to the true bottom during a live keyboard animation.
  if (keyboardOpen) return null;

  const accountHref = user ? "/account" : "/login";

  return (
    <nav
      aria-label="Primary"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface border-t border-border-subtle flex justify-around items-center py-2"
    >
      <TabLink href="/" active={pathname === "/"} label="Home">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <path d="M9 22V12h6v10" />
      </TabLink>
      <TabLink href="/track" active={pathname === "/track"} label="Track Order">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </TabLink>
      <button
        type="button"
        onClick={openCart}
        className="flex flex-col items-center gap-1 text-xs px-3 py-1 text-ink-light"
      >
        <span className="relative">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-5 h-5"
            aria-hidden="true"
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          {count > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-mango-orange text-white text-[0.6rem] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {count > 9 ? "9+" : count}
            </span>
          )}
        </span>
        Cart
      </button>
      <TabLink href={accountHref} active={pathname === accountHref} label="Account">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </TabLink>
    </nav>
  );
}

function TabLink({
  href,
  active,
  label,
  children,
}: {
  href: string;
  active: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex flex-col items-center gap-1 text-xs px-3 py-1 ${
        active ? "text-mango-orange" : "text-ink-light"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
        aria-hidden="true"
      >
        {children}
      </svg>
      {label}
    </Link>
  );
}
