"use client";

import { createContext, useContext, useMemo } from "react";
import { useSyncedLocalStorage, writeSyncedLocalStorage } from "@/lib/use-synced-local-storage";

const STORAGE_KEY = "theaamghar_compare";
const MAX_COMPARE = 4;
const EMPTY_IDS: string[] = [];

type CompareContextValue = {
  ids: string[];
  toggle: (id: string) => void;
  clear: () => void;
  isFull: boolean;
};

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const ids = useSyncedLocalStorage<string[]>(STORAGE_KEY, EMPTY_IDS);

  const value = useMemo<CompareContextValue>(() => {
    function toggle(id: string) {
      if (ids.includes(id)) {
        writeSyncedLocalStorage(STORAGE_KEY, ids.filter((i) => i !== id));
        return;
      }
      if (ids.length >= MAX_COMPARE) return;
      writeSyncedLocalStorage(STORAGE_KEY, [...ids, id]);
    }

    function clear() {
      writeSyncedLocalStorage(STORAGE_KEY, []);
    }

    return { ids, toggle, clear, isFull: ids.length >= MAX_COMPARE };
  }, [ids]);

  return <CompareContext value={value}>{children}</CompareContext>;
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within a CompareProvider");
  return ctx;
}
