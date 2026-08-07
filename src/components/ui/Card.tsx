"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// rounded-[24px] matches the design system's card radius; hover lift +
// deepened shadow is the one "meaningful" card interaction called for
// (no gratuitous tilt/rotate).
export function Card({
  children,
  className,
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -6 } : undefined}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "rounded-[24px] bg-white shadow-[0_8px_30px_rgba(74,44,18,0.08)]",
        hover && "hover:shadow-[0_20px_50px_rgba(74,44,18,0.14)] transition-shadow duration-300",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export function GlassCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[24px] bg-white/90 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgba(74,44,18,0.08)]",
        className
      )}
    >
      {children}
    </div>
  );
}
