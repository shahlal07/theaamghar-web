import { Reveal } from "@/components/reveal";
import { AnimatedCounter } from "@/components/animated-counter";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import type { SiteContent } from "@/lib/queries/site-content";

export function Story({ content }: { content: SiteContent["story"] }) {
  return (
    <Section id="story" aria-label="Our story" className="bg-[#FBEFDC] scroll-mt-24">
      <div className="max-w-3xl mx-auto text-center">
        <Reveal>
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
          />
        </Reveal>
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
    </Section>
  );
}

function Stat({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  return (
    <div>
      {/* font-sans for the same reason as StatCard: Cormorant's old-style
          figures make these counters visibly bounce as they animate. */}
      <div className="font-sans text-3xl font-bold text-[var(--color-golden)] tabular-nums">
        <AnimatedCounter value={value} suffix={suffix} />
      </div>
      <div className="text-xs text-[var(--color-ink)]/60 mt-1">{label}</div>
    </div>
  );
}
