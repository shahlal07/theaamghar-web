"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import type { FaqEntry } from "@/lib/queries/faq";

// Caller (app/page.tsx) already resolves the DB FAQs vs. the admin-editable
// site_content.faqFallback -- this component just renders whatever list it's
// handed, so the static FAQ and the AI chat widget can't drift out of sync
// with two different fallback sources.
export function FAQ({ faqs }: { faqs: FaqEntry[] }) {
  const items = faqs;
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <Section aria-label="Frequently asked questions" className="bg-[var(--color-cream-warm)] py-10 md:py-20 lg:py-[120px]">
      <Heading eyebrow="Questions" title="Frequently Asked" center className="mb-8 md:mb-12" />
      {/* Each question is already its own click-to-expand row (only the
          answer is hidden until tapped) -- that's exactly the compact
          pattern mobile needs, so unlike Why Choose Us / Our Story this list
          shows on every breakpoint; only the section's own padding shrinks
          on mobile. */}
      <div className="max-w-2xl mx-auto divide-y divide-[var(--color-mango-deep)]/10">
        {items.map((item) => {
          const open = openId === item.id;
          return (
            <div key={item.id}>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : item.id)}
                aria-expanded={open}
                className="w-full flex items-center justify-between gap-4 py-5 text-left"
              >
                <span className="font-serif text-lg font-semibold text-[var(--color-mango-deep-text)]">
                  {item.question}
                </span>
                <motion.span
                  animate={{ rotate: open ? 45 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="shrink-0 text-[var(--color-mango-deep-text)]"
                  aria-hidden="true"
                >
                  <Plus className="h-5 w-5" strokeWidth={2.5} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 text-[var(--color-ink)]/75 leading-relaxed">{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
