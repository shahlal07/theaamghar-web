import { cn } from "@/lib/utils";

const VARIANTS = {
  gold: "bg-[var(--color-golden)] text-[var(--color-golden-contrast)]",
  green: "bg-[var(--color-orchard-green)] text-white",
  dark: "bg-[var(--color-mango-deep)] text-white",
  glass: "bg-white/15 text-white border border-white/30 backdrop-blur-md",
  outline: "border border-[var(--color-mango-deep)]/20 text-[var(--color-mango-deep-text)]",
} as const;

export function Badge({
  children,
  variant = "gold",
  className,
}: {
  children: React.ReactNode;
  variant?: keyof typeof VARIANTS;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide",
        VARIANTS[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
