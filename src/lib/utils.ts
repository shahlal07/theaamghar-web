// Minimal classname joiner -- avoids pulling in clsx/tailwind-merge for
// what's just conditional string concatenation across the new premium UI
// primitives (components/ui/*). Falsy entries (false/null/undefined/"") are
// dropped so callers can write cn(base, condition && "extra") directly.
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
