"use client";

import { useCallback, useSyncExternalStore } from "react";

/* Hydration-safe localStorage reads: the server snapshot is always the
   caller's defaultValue (localStorage doesn't exist server-side), and
   useSyncExternalStore is the React-sanctioned way to let the client
   re-sync to the real stored value on mount without the "calling setState
   synchronously within an effect" cascading-render pattern that
   eslint-plugin-react-hooks now flags (react-hooks/set-state-in-effect).

   getSnapshot must return a referentially stable value when nothing
   changed, or React logs "getSnapshot should be cached" -- parsedCache
   below only produces a new object/array reference when the underlying
   raw string actually changed. */
const listeners = new Set<() => void>();
function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}
function emitChange() {
  listeners.forEach((listener) => listener());
}

const parsedCache = new Map<string, { raw: string | null; value: unknown }>();

function readParsed<T>(key: string, defaultValue: T): T {
  const raw = typeof window === "undefined" ? null : window.localStorage.getItem(key);
  const cached = parsedCache.get(key);
  if (cached && cached.raw === raw) return cached.value as T;

  let value: T;
  try {
    value = raw === null ? defaultValue : (JSON.parse(raw) as T);
  } catch {
    value = defaultValue;
  }
  parsedCache.set(key, { raw, value });
  return value;
}

export function useSyncedLocalStorage<T>(key: string, defaultValue: T): T {
  const getSnapshot = useCallback(() => readParsed(key, defaultValue), [key, defaultValue]);
  const getServerSnapshot = useCallback(() => defaultValue, [defaultValue]);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/* Writes go through here (not localStorage.setItem directly) so every
   useSyncedLocalStorage instance for this key -- including other
   components in the same tab -- re-renders with the new value. */
export function writeSyncedLocalStorage<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    parsedCache.set(key, { raw: window.localStorage.getItem(key), value });
  } catch {
    // storage unavailable (private mode) -- fail silently
  }
  emitChange();
}
