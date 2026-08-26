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
  const [{ vendor, settings }, { brand, aiAssistant }] = await Promise.all([
    getSiteChrome(),
    getSiteContent(),
  ]);
  const whatsappNumber = settings?.support_whatsapp ?? vendor?.whatsapp_number ?? null;

  return (
    // <main>'s pb-16 (reserved for the mobile tab bar) no longer applies on
    // /chat -- MainContent skips it for every page in MobileTabBar's own
    // exclusion list, /chat included -- so this only needs to subtract the
    // navbar height, not an extra 4rem for tab-bar space that isn't there.
    <div className="h-[calc(100dvh-var(--nav-height))] max-w-2xl mx-auto md:py-6 md:px-4">
      <div className="h-full md:rounded-brand md:border md:border-border-subtle md:shadow-brand-lg overflow-hidden">
        <ChatInterface
          whatsappNumber={whatsappNumber}
          businessName={brand.logoText}
          productPlural={aiAssistant.productPlural}
          accentEmoji={brand.accentEmoji}
        />
      </div>
    </div>
  );
}
