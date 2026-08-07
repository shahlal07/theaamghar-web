"use client";

import { useCallback, useSyncExternalStore } from "react";

const THEME_KEY = "od_theme";
const listeners = new Set<() => void>();
function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): "light" | "dark" {
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// null server snapshot -> render a placeholder until the client resyncs;
// useSyncExternalStore is the React-sanctioned way to do that resync
// without the "setState in an effect" cascading-render pattern
// eslint-plugin-react-hooks now flags.
function getServerSnapshot() {
  return null;
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next: "light" | "dark") => {
    document.documentElement.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem(THEME_KEY, next);
    } catch {
      // private mode -- fail silently
    }
    listeners.forEach((l) => l());
  }, []);

  if (theme === null) {
    return <span className="w-11 h-11 md:w-9 md:h-9 inline-block" aria-hidden="true" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      // 44px on mobile to match the tap-target standard used elsewhere
      // (and NotificationBell, which now sits right beside this in the
      // navbar's always-visible mobile cluster); desktop keeps 36px.
      className="w-11 h-11 md:w-9 md:h-9 flex items-center justify-center rounded-full border border-border-subtle text-ink hover:border-mango-orange hover:text-mango-orange transition-colors"
    >
      {isDark ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4.5 h-4.5"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4.5 h-4.5"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
