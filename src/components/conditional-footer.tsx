"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/footer";
import type { Tables } from "@/lib/supabase/types";
import type { SiteContent } from "@/lib/queries/site-content";

// Same exclusion pattern as mobile-tab-bar.tsx's EXCLUDED_PREFIXES: /chat is
// meant to feel like a fixed, app-like chat panel (h-dvh, internal scroll
// only) -- the marketing footer rendering underneath it turned the whole
// page scrollable, defeating that and pushing the input off-screen on short
// viewports.
const EXCLUDED_PREFIXES = ["/chat"];

export function ConditionalFooter({
  settings,
  content,
}: {
  settings: Tables<"public_business_settings"> | null;
  content: SiteContent;
}) {
  const pathname = usePathname();
  if (EXCLUDED_PREFIXES.some((p) => pathname.startsWith(p))) return null;
  return <Footer settings={settings} content={content} />;
}
