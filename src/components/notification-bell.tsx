"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@/lib/use-user";
import { getUnreadNotificationCount } from "@/lib/queries/notifications-client";

// Sits in the navbar so notifications are reachable from every page, not
// only from inside the account section. Renders nothing at all for signed-out
// visitors -- there's nothing to notify them about, and an always-visible
// bell that just bounces to /login is noise.
export function NotificationBell() {
  const { user } = useUser();
  const pathname = usePathname();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    // Re-checked on navigation (not polled) so the badge clears after the
    // customer visits the notifications page, without holding an open
    // subscription on every page for a low-frequency event.
    getUnreadNotificationCount().then((n) => {
      if (!cancelled) setCount(n);
    });
    return () => {
      cancelled = true;
    };
  }, [user, pathname]);

  if (!user) return null;

  return (
    <Link
      href="/account/notifications"
      aria-label={count > 0 ? `Notifications, ${count} unread` : "Notifications"}
      className="relative flex items-center justify-center w-11 h-11 md:w-9 md:h-9 rounded-full text-ink hover:text-mango-orange hover:bg-cream-warm transition-colors"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        width="20"
        height="20"
        aria-hidden="true"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      {count > 0 && (
        <span className="absolute top-0.5 right-0.5 md:-top-0.5 md:-right-0.5 bg-mango-orange text-white text-[0.65rem] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center tabular-nums">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
