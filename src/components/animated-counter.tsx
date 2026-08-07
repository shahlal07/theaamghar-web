"use client";

import { useEffect, useRef, useState } from "react";

// Counts up from 0 to `value` once the number scrolls into view, then never
// re-runs -- a small "the numbers are real" moment for the story section's
// trust stats. Respects prefers-reduced-motion by jumping straight to the
// final value instead of animating (checked once, not observed, since a
// user's motion preference doesn't change mid-session).
export function AnimatedCounter({
  value,
  suffix = "",
  duration = 1400,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      // Deferred to a microtask so this is a callback response to the media
      // query rather than a synchronous setState during the effect's commit
      // -- same pattern as product-grid.tsx's filter reset.
      Promise.resolve().then(() => setDisplay(value));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        function tick(now: number) {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(eased * value));
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}
