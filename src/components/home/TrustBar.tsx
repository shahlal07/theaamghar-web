"use client";

import { motion } from "framer-motion";
import { Star, Truck, Leaf, Wallet, Sprout } from "lucide-react";
import { GlassCard } from "@/components/ui/Card";

// Icons are decorative and cycle through a fixed set regardless of content
// -- only the label text is admin-editable (site_content.trustBar.items).
const ICONS = [Star, Truck, Leaf, Wallet, Sprout] as const;

// Floats over the hero's bottom edge (-mt-16) the way a premium ecommerce
// trust strip does -- one glass panel, not five separate cards.
export function TrustBar({ items }: { items: string[] }) {
  return (
    <div className="relative -mt-14 md:-mt-16 z-30 px-6 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-[1280px]"
      >
        <GlassCard className="grid grid-cols-5">
          {items.map((title, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <motion.div
                key={title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex flex-col items-center justify-center gap-1 py-3 px-1 lg:gap-2.5 lg:py-7 lg:px-0 border-r last:border-r-0 border-[var(--color-mango-deep)]/10"
              >
                <div className="h-7 w-7 lg:h-12 lg:w-12 rounded-full bg-[var(--color-golden)]/12 flex items-center justify-center">
                  <Icon className="h-3.5 w-3.5 lg:h-5 lg:w-5 text-[var(--color-orchard-green-text)]" strokeWidth={2} aria-hidden="true" />
                </div>
                <p className="w-full truncate text-[10px] lg:text-sm font-semibold text-[var(--color-mango-deep-text)] text-center px-0.5 lg:px-3">
                  {title}
                </p>
              </motion.div>
            );
          })}
        </GlassCard>
      </motion.div>
    </div>
  );
}
