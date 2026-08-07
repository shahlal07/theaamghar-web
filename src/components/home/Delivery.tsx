"use client";

import { motion } from "framer-motion";
import { Truck } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import type { SiteContent } from "@/lib/queries/site-content";

// Real cities pulled from shipping_zones (see getDeliveryCoverage) -- not a
// decorative "we deliver everywhere" map. If an admin hasn't set up any
// city-level overrides yet, this quietly shows nothing rather than a fake list.
export function Delivery({
  coverage,
  content,
}: {
  coverage: Record<string, string[]>;
  content: SiteContent["delivery"];
}) {
  const provinces = Object.keys(coverage);
  if (provinces.length === 0) return null;

  return (
    <Section aria-label="Delivery coverage" className="bg-[#4A2C12] text-white overflow-hidden">
      <Heading
        eyebrow={content.eyebrow}
        title={content.title}
        subtitle={content.subtitle}
        center
        light
        className="mb-14"
      />
      <div className="space-y-10 max-w-4xl mx-auto">
        {provinces.map((province, pIndex) => (
          <motion.div
            key={province}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: pIndex * 0.08 }}
            className="text-center"
          >
            <div className="text-xs font-semibold tracking-[0.2em] uppercase text-[#F4B400] mb-4">
              {province}
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {coverage[province].map((city) => (
                <Badge key={city} variant="glass">
                  <Truck className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                  {city}
                </Badge>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
