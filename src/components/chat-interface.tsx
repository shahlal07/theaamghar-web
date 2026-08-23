"use client";

import { useEffect, useRef, useState } from "react";
import { generalInquiryWhatsAppLink } from "@/lib/whatsapp";

type ChatMessage = { role: "user" | "assistant"; content: string };
type Language = "en" | "ur";

// Detected per-message (not just from the current toggle state) so a bubble
// written in Urdu script still reads right-to-left even if the customer
// switches languages again later in the same conversation.
const URDU_SCRIPT_PATTERN = /[؀-ۿݐ-ݿ]/;

function greetings(businessName: string, productPlural: string, accentEmoji: string): Record<Language, string> {
  return {
    en: `Hi! I'm the ${businessName} support assistant. Ask me about orders, delivery, payments, or anything ${productPlural}-related ${accentEmoji}`,
    ur: `السلام علیکم! میں ${businessName} کا معاون ہوں۔ آرڈر، ڈیلیوری، ادائیگی یا اس بارے میں کچھ بھی پوچھیں ${accentEmoji}`,
  };
}

// Shared chat UI, rendered full-page by /chat/page.tsx. Previously this was
// the guts of a fixed-position overlay panel that customers reported as
// broken on mobile (input sliding under the keyboard, panel misbehaving at
// odd viewport sizes). A real page sized with the browser's native dynamic
// viewport unit doesn't need any of the visualViewport workarounds the
// overlay required -- the parent page.tsx sizes this to h-dvh and the
// browser handles keyboard resize on its own.
export function ChatInterface({
  whatsappNumber,
  businessName,
  productPlural,
  accentEmoji,
}: {
  whatsappNumber: string | null;
  businessName: string;
  productPlural: string;
  accentEmoji: string;
}) {
  const [language, setLanguage] = useState<Language>("en");
  const GREETINGS = greetings(businessName, productPlural, accentEmoji);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: GREETINGS.en },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleLanguageChange(next: Language) {
    if (next === language) return;
    setLanguage(next);
    setMessages((prev) => [...prev, { role: "assistant", content: GREETINGS[next] }]);
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  // A real page can safely autofocus on mount (an overlay can't -- doing so
  // there yanked the keyboard open the instant the panel appeared).
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || pending) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setPending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          language: language === "ur" ? "ur" : undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 503) setUnavailable(true);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.error ?? "Something went wrong. Please try again." },
        ]);
        return;
      }
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again or message us on WhatsApp." },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col h-full bg-surface">
      <div className="flex items-center justify-between px-4 py-3 bg-mango-orange text-white shrink-0">
        <div>
          <div className="font-serif font-bold">{businessName} Support</div>
          <div className="text-xs text-white/85">Usually replies instantly</div>
        </div>
        <div className="flex rounded-full bg-white/15 p-0.5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => handleLanguageChange("en")}
            aria-pressed={language === "en"}
            className={`px-3 py-1.5 rounded-full transition-colors ${
              language === "en" ? "bg-white text-mango-deep" : "text-white/85"
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange("ur")}
            aria-pressed={language === "ur"}
            className={`px-3 py-1.5 rounded-full transition-colors ${
              language === "ur" ? "bg-white text-mango-deep" : "text-white/85"
            }`}
          >
            اردو
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.map((m, i) => (
          <div
            key={i}
            dir={URDU_SCRIPT_PATTERN.test(m.content) ? "rtl" : "ltr"}
            className={`max-w-[85%] sm:max-w-[70%] text-sm px-4 py-2.5 rounded-brand-sm ${
              m.role === "user"
                ? "self-end bg-mango-orange text-white"
                : "self-start bg-cream-warm text-ink"
            }`}
          >
            {m.content}
          </div>
        ))}
        {pending && (
          <div
            dir={language === "ur" ? "rtl" : "ltr"}
            className="self-start bg-cream-warm text-ink-light text-sm px-4 py-2.5 rounded-brand-sm"
          >
            {language === "ur" ? "لکھ رہا ہوں…" : "Typing…"}
          </div>
        )}
        {unavailable && whatsappNumber && (
          <a
            href={generalInquiryWhatsAppLink(whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start text-sm font-semibold text-mango-orange underline"
          >
            Chat with us on WhatsApp instead →
          </a>
        )}
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t border-border-subtle shrink-0">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={language === "ur" ? "اپنا سوال لکھیں…" : "Type your question…"}
          dir={language === "ur" ? "rtl" : "ltr"}
          maxLength={1000}
          className="flex-1 border border-border-subtle rounded-full px-4 py-2.5 text-base bg-surface"
        />
        <button
          type="submit"
          disabled={pending || !input.trim()}
          aria-label="Send message"
          className="w-11 h-11 shrink-0 rounded-full bg-mango-orange text-white flex items-center justify-center disabled:opacity-50"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>
    </div>
  );
}
