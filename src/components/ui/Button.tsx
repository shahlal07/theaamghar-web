"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const VARIANTS = {
  primary: "bg-[var(--color-golden)] text-[var(--color-ink)] hover:bg-[#e0a600]",
  dark: "bg-[var(--color-orchard-green)] text-white hover:bg-[#256428]",
  outline: "border border-white/40 text-white hover:bg-white hover:text-[var(--color-ink)]",
  "outline-dark": "border border-[var(--color-mango-deep)]/25 text-[var(--color-mango-deep)] hover:bg-[var(--color-mango-deep)] hover:text-white",
} as const;

const SIZES = {
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-3.5 text-base",
} as const;

type ButtonProps = {
  children: React.ReactNode;
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  className?: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

// A single element (either <a> via next/link, or <button>) never both --
// avoids nesting an interactive <button> inside an <a>, which the original
// hero draft did.
export function Button({
  children,
  variant = "primary",
  size = "lg",
  className,
  href,
  onClick,
  type = "button",
  disabled,
}: ButtonProps) {
  const classes = cn(
    "group inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-300 disabled:opacity-50 disabled:pointer-events-none",
    VARIANTS[variant],
    SIZES[size],
    className
  );

  const motionProps = {
    whileHover: disabled ? undefined : { scale: 1.03, y: -2 },
    whileTap: disabled ? undefined : { scale: 0.97, y: 0 },
    transition: { duration: 0.2 },
  };

  if (href) {
    return (
      <motion.div {...motionProps} className="inline-block">
        <Link href={href} className={classes}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}
