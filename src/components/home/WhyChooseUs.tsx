"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sunrise, Ban, TreePine, Package, ChevronDown } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import type { SiteContent } from "@/lib/queries/site-content";

// Icon-forward blocks rather than stock/AI photography for a claim like
// "Farm Direct" -- the site owner's own point (see brand-direction
// discussion): real photography or nothing, never filler images pretending
// to be real orchard/packaging shots. Icons are decorative/fixed; only the
// title/body text is admin-editable (site_content.whyChooseUs.reasons).
const ICONS = [Sunrise, Ban, TreePine, Package] as const;

export function WhyChooseUs({ content }: { content: SiteContent["whyChooseUs"] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Section aria-label="Why choose us" className="bg-[var(--color-cream-warm)] py-10 md:py-20 lg:py-[120px]">
      {/* Heading always shows. The detailed reason-by-reason body made the
          mobile homepage feel congested (most traffic is mobile), so below
          md it's a tap-to-expand accordion instead of always-hidden content
          -- and the section's own padding shrinks on mobile so a collapsed
          section doesn't leave a big empty gap either. */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full md:pointer-events-none md:cursor-default"
        aria-expanded={expanded}
      >
        <Heading eyebrow={content.eyebrow} title={content.title} center className="mb-0 md:mb-16" />
        <ChevronDown
          className={`mx-auto mt-3 h-5 w-5 text-[var(--color-mango-deep-text)] transition-transform md:hidden ${expanded ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden md:!h-auto md:!opacity-100"
          >
            <div className="space-y-10 pt-8 md:hidden">
              {content.reasons.map((reason, index) => (
                <MobileReason key={reason.title} reason={reason} index={index} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden md:block space-y-14">
        {content.reasons.map((reason, index) => (
          <motion.div
            key={reason.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${
              index % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            <div className="shrink-0 h-32 w-32 md:h-40 md:w-40 rounded-full bg-gradient-to-br from-[var(--color-golden)]/15 to-[var(--color-orchard-green)]/10 flex items-center justify-center">
              {(() => {
                const Icon = ICONS[index % ICONS.length];
                return <Icon className="h-14 w-14 md:h-16 md:w-16 text-[var(--color-orchard-green-text)]" strokeWidth={1.5} aria-hidden="true" />;
              })()}
            </div>
            <div className="text-center md:text-left max-w-lg">
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-[var(--color-mango-deep-text)] mb-3">
                {reason.title}
              </h3>
              <p className="text-[var(--color-ink)]/75 text-lg leading-relaxed">{reason.body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function MobileReason({ reason, index }: { reason: { title: string; body: string }; index: number }) {
  const Icon = ICONS[index % ICONS.length];
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="shrink-0 h-20 w-20 rounded-full bg-gradient-to-br from-[var(--color-golden)]/15 to-[var(--color-orchard-green)]/10 flex items-center justify-center">
        <Icon className="h-9 w-9 text-[var(--color-orchard-green-text)]" strokeWidth={1.5} aria-hidden="true" />
      </div>
      <div>
        <h3 className="font-serif text-lg font-bold text-[var(--color-mango-deep-text)] mb-1.5">{reason.title}</h3>
        <p className="text-[var(--color-ink)]/75 text-sm leading-relaxed">{reason.body}</p>
      </div>
    </div>
  );
}
