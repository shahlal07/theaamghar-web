"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/sign-out-button";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  comingSoon?: boolean;
};

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}
function OrdersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
function WishlistIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
function ReviewsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
function AddressIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function RewardsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="6" />
      <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
function BugIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="8" y="6" width="8" height="14" rx="4" />
      <path d="M8 12H2M22 12h-6M9 4l-1.5-1.5M15 4l1.5-1.5M9 20l-1.5 1.5M15 20l1.5 1.5M8 9H4M20 9h-4M8 15H4M20 15h-4" />
    </svg>
  );
}
function GiftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

type AccountProfile = { name: string | null; email: string | null } | null;

export function AccountShell({
  profile,
  unreadCount,
  children,
}: {
  profile: AccountProfile;
  unreadCount: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Lock background scroll while the drawer is open -- otherwise the page
  // behind it scrolls under the customer's finger on mobile.
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const navItems: NavItem[] = [
    { href: "/account", label: "Dashboard", icon: <DashboardIcon /> },
    { href: "/account/orders", label: "My Orders", icon: <OrdersIcon /> },
    { href: "/account/wishlist", label: "Wishlist", icon: <WishlistIcon /> },
    { href: "/account/reviews", label: "My Reviews", icon: <ReviewsIcon /> },
    { href: "/account/addresses", label: "Saved Addresses", icon: <AddressIcon /> },
    { href: "/account/profile", label: "Profile", icon: <ProfileIcon /> },
    { href: "/report-bug", label: "Report a Bug", icon: <BugIcon /> },
    { href: "/account/rewards", label: "Rewards", icon: <RewardsIcon /> },
    {
      href: "/account/notifications",
      label: "Notifications",
      icon: <BellIcon />,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { href: "/account/gifts", label: "Gift Orders", icon: <GiftIcon /> },
    { href: "/account/settings", label: "Settings", icon: <SettingsIcon /> },
  ];

  const initials =
    profile?.name
      ?.split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  return (
    <div className="px-[5%] py-8 max-w-6xl mx-auto grid lg:grid-cols-[260px_1fr] gap-6 lg:gap-10 items-start">
      {/* Mobile: a "Menu" bar that opens a real off-canvas sidebar, matching
          the admin panel. Replaces a horizontal scrolling pill strip where
          later items (Settings, Gift Orders) were effectively hidden -- every
          destination is now in one predictable list. */}
      <div className="lg:hidden flex items-center justify-between gap-3 mb-2">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open account menu"
          aria-expanded={drawerOpen}
          className="flex items-center gap-2.5 min-h-[44px] px-4 rounded-xl border border-border-subtle bg-surface text-sm font-semibold"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="18" height="18" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          Menu
          {unreadCount > 0 && (
            <span className="bg-mango-orange text-white text-[0.65rem] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center tabular-nums">
              {unreadCount}
            </span>
          )}
        </button>
        <span className="text-sm font-semibold text-ink-light truncate">
          {navItems.find((i) => i.href === pathname)?.label ?? "Account"}
        </span>
      </div>

      {drawerOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[1200] bg-black/50"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}
      <div
        role="dialog"
        aria-modal={drawerOpen || undefined}
        aria-label="Account menu"
        className={`lg:hidden fixed inset-y-0 left-0 z-[1201] w-[280px] max-w-[85vw] bg-surface shadow-brand-lg overflow-y-auto transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border-subtle">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-mango-orange to-mango-deep text-white flex items-center justify-center font-bold shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-sm truncate">{profile?.name ?? "Welcome"}</div>
              <div className="text-xs text-ink-light truncate">{profile?.email}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close account menu"
            className="w-11 h-11 shrink-0 flex items-center justify-center rounded-full hover:bg-cream-warm"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="18" height="18" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <ul className="flex flex-col gap-1 p-3">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.comingSoon ? "#" : item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={(e) => {
                    if (item.comingSoon) {
                      e.preventDefault();
                      return;
                    }
                    setDrawerOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 min-h-[44px] rounded-xl text-sm font-medium transition-colors ${
                    active ? "bg-mango-orange/10 text-mango-orange" : "text-ink hover:bg-cream-warm"
                  } ${item.comingSoon ? "opacity-60 cursor-default" : ""}`}
                >
                  <span className="w-4.5 h-4.5 shrink-0 [&_svg]:w-[18px] [&_svg]:h-[18px]">
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[0.65rem] font-bold rounded-full px-2 py-0.5 tabular-nums ${
                        item.comingSoon
                          ? "bg-border-subtle text-ink-light"
                          : "bg-mango-orange text-white"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="p-4 border-t border-border-subtle">
          <SignOutButton />
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block sticky top-[calc(var(--nav-height)+24px)]">
        <div className="bg-surface border border-border-subtle rounded-2xl shadow-brand-sm p-5">
          <div className="flex items-center gap-3 pb-5 mb-5 border-b border-border-subtle">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mango-orange to-mango-deep text-white flex items-center justify-center font-bold shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-sm truncate">{profile?.name ?? "Welcome"}</div>
              <div className="text-xs text-ink-light truncate">{profile?.email}</div>
            </div>
          </div>

          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.comingSoon ? "#" : item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={item.comingSoon ? (e) => e.preventDefault() : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? "bg-mango-orange/10 text-mango-orange"
                        : "text-ink hover:bg-cream-warm"
                    } ${item.comingSoon ? "opacity-60 cursor-default" : ""}`}
                  >
                    <span className="w-4.5 h-4.5 shrink-0 [&_svg]:w-[18px] [&_svg]:h-[18px]">
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.label}</span>
                    {item.badge !== undefined && (
                      <span
                        className={`text-[0.65rem] font-bold rounded-full px-2 py-0.5 ${
                          item.comingSoon
                            ? "bg-border-subtle text-ink-light"
                            : "bg-mango-orange text-white"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 pt-5 border-t border-border-subtle">
            <SignOutButton />
          </div>
        </div>
      </aside>

      <div className="min-w-0">{children}</div>
    </div>
  );
}
