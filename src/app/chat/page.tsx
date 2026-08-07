import type { Metadata } from "next";
import { getSiteChrome } from "@/lib/queries/site";
import { getSiteContent } from "@/lib/queries/site-content";
import { ChatInterface } from "@/components/chat-interface";

export async function generateMetadata(): Promise<Metadata> {
  const { brand, aiAssistant } = await getSiteContent();
  return {
    title: "Chat with Us",
    description: `Ask ${brand.logoText}'s support assistant about orders, delivery, payments, or anything ${aiAssistant.productSingular}-related.`,
  };
}

// A real page instead of a fixed-position overlay -- the overlay panel
// (previously toggled from the floating chat bubble) misbehaved on mobile:
// fighting the keyboard, awkward at odd viewport sizes. h-dvh is the
// dynamic viewport height unit, which the browser itself shrinks when the
// on-screen keyboard opens, so the input naturally stays above it with no
// visualViewport workaround needed.
export default async function ChatPage() {
  const { vendor, settings } = await getSiteChrome();
  const whatsappNumber = settings?.support_whatsapp ?? vendor?.whatsapp_number ?? null;

  return (
    // The mobile tab bar is excluded on /chat (see mobile-tab-bar.tsx), but
    // its parent <main> still reserves pb-16 for it on every page -- account
    // for that here so this doesn't overflow into a second, page-level
    // scrollbar on top of the panel's own internal one.
    <div className="h-[calc(100dvh-var(--nav-height)-4rem)] md:h-[calc(100dvh-var(--nav-height))] max-w-2xl mx-auto md:py-6 md:px-4">
      <div className="h-full md:rounded-brand md:border md:border-border-subtle md:shadow-brand-lg overflow-hidden">
        <ChatInterface whatsappNumber={whatsappNumber} />
      </div>
    </div>
  );
}
