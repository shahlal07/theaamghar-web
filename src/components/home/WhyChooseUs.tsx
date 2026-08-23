"use client";

import { motion } from "framer-motion";
import { Sunrise, Ban, TreePine, Package } from "lucide-react";
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
  return (
    <Section aria-label="Why choose us" className="bg-[var(--color-cream-warm)]">
      <Heading eyebrow={content.eyebrow} title={content.title} center className="mb-16" />
      <div className="space-y-14">
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
