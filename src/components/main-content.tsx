"use client";

import { usePathname } from "next/navigation";
import { EXCLUDED_PREFIXES } from "@/components/mobile-tab-bar";

// <main> reserved pb-16 unconditionally on mobile so page content never
// sits under the fixed bottom tab bar -- but on pages where MobileTabBar
// itself opts out (checkout/login/signup/chat), that pb-16 became pure dead
// space at the bottom of the screen instead. Most visible on /chat, whose
// own height calc already subtracts an equivalent 4rem specifically to
// avoid double-reserving it, so before this fix a customer got a real,
// visible empty strip below the message input for no reason (a genuine
// customer report: the chat page "so congested... remove extra white
// spaces"). Shares MobileTabBar's own exclusion list rather than
// duplicating it, so the two can never drift out of sync.
export function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const tabBarHidden = EXCLUDED_PREFIXES.some((p) => pathname.startsWith(p));

  return (
    <main id="main" className={`flex-1 pt-[var(--nav-height)] ${tabBarHidden ? "" : "pb-16 md:pb-0"}`}>
      {children}
    </main>
  );
}
