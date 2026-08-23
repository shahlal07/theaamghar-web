import { cn } from "@/lib/utils";

// Reuses the site's existing self-hosted Cormorant Garamond (font-serif)
// rather than pulling in Playfair Display via next/font/google -- one less
// runtime font fetch, and keeps every serif heading on the site (existing
// pages included) rendering from the same already-loaded font file.
const SIZES = {
  md: "text-3xl lg:text-4xl",
  lg: "text-4xl lg:text-5xl",
  xl: "text-5xl lg:text-7xl",
} as const;

export function Heading({
  eyebrow,
  title,
  subtitle,
  size = "lg",
  center = false,
  light = false,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  size?: keyof typeof SIZES;
  center?: boolean;
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(center && "text-center", className)}>
      {eyebrow && (
        <span
          className={cn(
            "inline-block text-xs font-semibold tracking-[0.25em] uppercase mb-4",
            light ? "text-white/80" : "text-[var(--color-orchard-green-text)]"
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "font-serif font-bold leading-[1.1]",
          SIZES[size],
          light ? "text-white" : "text-[var(--color-mango-deep-text)]"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-5 text-lg leading-relaxed",
            center && "mx-auto max-w-2xl",
            light ? "text-white/85" : "text-[var(--color-ink)]/75"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
