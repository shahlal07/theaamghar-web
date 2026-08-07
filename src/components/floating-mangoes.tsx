// Subtle decorative drift across the hero -- ported concept from the
// original static site's `drift` keyframe (../Theaamghar/css/base.css),
// which never made it into this rewrite's design-system port. Purely
// decorative: aria-hidden, pointer-events-none, and respects
// prefers-reduced-motion via the global reduced-motion override in
// globals.css (same rule that already disables every other animation here).
const MANGOES = [
  { top: "12%", duration: "22s", delay: "0s", size: "1.5rem" },
  { top: "35%", duration: "28s", delay: "-8s", size: "1rem" },
  { top: "58%", duration: "25s", delay: "-15s", size: "1.25rem" },
  { top: "22%", duration: "32s", delay: "-4s", size: "0.9rem" },
];

export function FloatingMangoes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]" aria-hidden="true">
      {MANGOES.map((m, i) => (
        <span
          key={i}
          className="absolute left-0"
          style={{
            top: m.top,
            fontSize: m.size,
            animation: `drift ${m.duration} linear infinite`,
            animationDelay: m.delay,
          }}
        >
          🥭
        </span>
      ))}
    </div>
  );
}
