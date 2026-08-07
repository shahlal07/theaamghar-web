import { generalInquiryWhatsAppLink } from "@/lib/whatsapp";

export function WhatsAppButton({ whatsappNumber }: { whatsappNumber: string | null }) {
  if (!whatsappNumber) return null;

  return (
    <a
      href={generalInquiryWhatsAppLink(whatsappNumber)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-[136px] md:bottom-20 right-5 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-brand-lg hover:scale-105 transition-transform"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7" aria-hidden="true">
        <path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4a7.94 7.94 0 0 0-6.9 11.9L4 20l4.2-1.1a7.9 7.9 0 0 0 3.85 1h.02a7.94 7.94 0 0 0 5.53-13.58ZM12.05 18.4h-.02a6.55 6.55 0 0 1-3.35-.92l-.24-.14-2.5.65.67-2.44-.16-.25a6.56 6.56 0 0 1 5.6-10.1 6.56 6.56 0 0 1 4.63 11.2 6.5 6.5 0 0 1-4.63 1.94Zm3.6-4.9c-.2-.1-1.17-.58-1.35-.64-.18-.07-.31-.1-.44.1-.13.2-.5.64-.62.77-.11.13-.23.15-.42.05-.2-.1-.83-.3-1.58-.97a5.94 5.94 0 0 1-1.1-1.36c-.11-.2 0-.3.1-.4.1-.1.2-.24.3-.35.1-.12.14-.2.2-.33.07-.13.04-.25 0-.35-.05-.1-.44-1.06-.6-1.45-.16-.38-.32-.33-.44-.34h-.38c-.13 0-.35.05-.53.25-.18.2-.7.68-.7 1.66s.72 1.92.82 2.05c.1.13 1.4 2.14 3.4 3 .48.2.85.33 1.14.42.48.15.92.13 1.26.08.39-.06 1.17-.48 1.34-.94.16-.46.16-.86.11-.94-.05-.09-.18-.14-.38-.24Z" />
      </svg>
    </a>
  );
}
