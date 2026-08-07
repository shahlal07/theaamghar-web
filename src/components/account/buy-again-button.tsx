"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { reorderItems, type ReorderItem } from "@/lib/queries/cart";

export function BuyAgainButton({
  items,
  className,
}: {
  items: ReorderItem[];
  className?: string;
}) {
  const { addItem, openCart } = useCart();
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [skipped, setSkipped] = useState(0);

  async function handleClick() {
    setStatus("loading");
    const result = await reorderItems(items, addItem);
    setSkipped(result.skippedCount);
    setStatus("done");
    if (result.addedCount > 0) openCart();
    setTimeout(() => setStatus("idle"), 3000);
  }

  return (
    <div className="inline-flex flex-col items-start">
      <button
        type="button"
        onClick={handleClick}
        disabled={status === "loading"}
        className={
          className ??
          "text-xs font-semibold text-orchard-green border border-orchard-green/30 rounded-full px-4 py-1.5 hover:bg-orchard-green hover:text-white transition-colors disabled:opacity-50"
        }
      >
        {status === "loading" ? "Adding…" : status === "done" ? "Added to cart ✓" : "Buy Again"}
      </button>
      {status === "done" && skipped > 0 && (
        <span className="text-[0.65rem] text-ink-light mt-1">
          {skipped} item{skipped > 1 ? "s" : ""} no longer available
        </span>
      )}
    </div>
  );
}
