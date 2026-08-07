"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCompare } from "@/lib/compare-context";
import { getProductNamesByIds } from "@/lib/queries/compare-client";

export function CompareBar() {
  const { ids, toggle, clear } = useCompare();
  const router = useRouter();
  const [names, setNames] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    getProductNamesByIds(ids).then(setNames);
  }, [ids]);

  if (ids.length === 0) return null;

  return (
    <div className="fixed bottom-16 md:bottom-4 left-1/2 -translate-x-1/2 z-[1050] w-[92%] max-w-lg">
      <div className="bg-ink text-cream rounded-full shadow-brand-lg px-4 py-2.5 flex items-center gap-3">
        <div className="flex items-center gap-1.5 flex-1 overflow-x-auto [scrollbar-width:none]">
          {ids.map((id) => (
            <span
              key={id}
              className="shrink-0 flex items-center gap-1 bg-white/10 rounded-full pl-3 pr-1.5 py-1 text-xs whitespace-nowrap"
            >
              {names.get(id) ?? "…"}
              <button
                type="button"
                onClick={() => toggle(id)}
                aria-label={`Remove ${names.get(id) ?? "item"} from comparison`}
                className="w-4 h-4 rounded-full bg-white/15 flex items-center justify-center"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={() => router.push(`/compare?ids=${ids.join(",")}`)}
          disabled={ids.length < 2}
          className="shrink-0 bg-mango-orange text-white text-xs font-semibold px-4 py-2 rounded-full disabled:opacity-40 whitespace-nowrap"
        >
          Compare ({ids.length})
        </button>
        <button
          type="button"
          onClick={clear}
          aria-label="Clear comparison"
          className="shrink-0 text-cream/60 text-xs"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
