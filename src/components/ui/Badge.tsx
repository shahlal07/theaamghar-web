import { cn } from "@/lib/utils";

const VARIANTS = {
  gold: "bg-[#F4B400] text-[#2D2D2D]",
  green: "bg-[#2E7D32] text-white",
  dark: "bg-[#4A2C12] text-white",
  glass: "bg-white/15 text-white border border-white/30 backdrop-blur-md",
  outline: "border border-[#4A2C12]/20 text-[#4A2C12]",
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
