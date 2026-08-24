"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/reveal";
import { AnimatedCounter } from "@/components/animated-counter";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import type { SiteContent } from "@/lib/queries/site-content";

export function Story({ content }: { content: SiteContent["story"] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Section id="story" aria-label="Our story" className="bg-[var(--color-cream-warm)] scroll-mt-24 py-10 md:py-20 lg:py-[120px]">
      <div className="max-w-3xl mx-auto text-center">
        <Reveal>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="w-full md:pointer-events-none md:cursor-default"
            aria-expanded={expanded}
          >
            <Heading
              eyebrow={content.eyebrow}
              title={
                <>
                  {content.titleLine1}
                  <br />
                  {content.titleLine2}
                </>
              }
              center
              className="mb-0"
            />
            <ChevronDown
              className={`mx-auto mt-3 h-5 w-5 text-[var(--color-mango-deep-text)] transition-transform md:hidden ${expanded ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>
        </Reveal>

        {/* Heading above always shows. The paragraphs + stats are dense body
            content that made the mobile homepage feel congested (most
            traffic is mobile) -- tap-to-expand below md instead of always
            hidden, and the section's own padding shrinks on mobile so a
            collapsed section doesn't leave a big empty gap either. */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden md:hidden"
            >
              <p className="text-[var(--color-ink)]/75 leading-relaxed mt-6 mb-4">{content.paragraph1}</p>
              <p className="text-[var(--color-ink)]/75 leading-relaxed mb-8">{content.paragraph2}</p>
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                {content.stats.map((stat) => (
                  <Stat key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="hidden md:block">
          <Reveal delay={100}>
            <p className="text-[var(--color-ink)]/75 text-lg leading-relaxed mt-8 mb-4">{content.paragraph1}</p>
          </Reveal>
          <Reveal delay={180}>
            <p className="text-[var(--color-ink)]/75 text-lg leading-relaxed mb-12">{content.paragraph2}</p>
          </Reveal>
          <Reveal delay={260}>
            <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
              {content.stats.map((stat) => (
                <Stat key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

function Stat({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  return (
    <div>
      {/* font-sans for the same reason as StatCard: Cormorant's old-style
          figures make these counters visibly bounce as they animate. */}
      <div className="font-sans text-3xl font-bold text-[var(--color-mango-deep-text)] tabular-nums">
        <AnimatedCounter value={value} suffix={suffix} />
      </div>
      <div className="text-xs text-[var(--color-ink)]/60 mt-1">{label}</div>
    </div>
  );
}
