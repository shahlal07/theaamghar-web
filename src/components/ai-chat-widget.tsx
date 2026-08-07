import Link from "next/link";

// This used to open a fixed-position overlay panel in place, with its own
// message list/input/etc. Customers reported it breaking on mobile -- the
// keyboard covering the input, odd behavior at various viewport sizes.
// Rather than keep patching a fixed overlay against every mobile browser's
// keyboard quirks, the chat itself moved to a real page (/chat, see
// components/chat-interface.tsx) that a normal page's layout and the
// browser's own dynamic-viewport handling deal with correctly. This stays
// as the floating entry point customers already know, on every page --
// same component name/prop so nothing else needs to change.
export function AIChatWidget({ whatsappNumber: _whatsappNumber }: { whatsappNumber: string | null }) {
  return (
    <Link
      href="/chat"
      aria-label="Open support chat"
      className="fixed bottom-[204px] md:bottom-[148px] right-5 z-40 w-14 h-14 rounded-full bg-mango-orange text-white flex items-center justify-center shadow-brand-lg hover:scale-105 transition-transform"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="26" height="26" aria-hidden="true">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    </Link>
  );
}
