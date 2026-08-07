"use client";

import { useState } from "react";
import { AddressFormPanel } from "@/components/account/address-form-panel";

export function AddAddressCard() {
  const [open, setOpen] = useState(false);

  if (open) return <AddressFormPanel onDone={() => setOpen(false)} />;

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border-subtle rounded-brand p-5 min-h-[140px] text-ink-light hover:border-mango-orange hover:text-mango-orange transition-colors"
    >
      <span className="text-2xl leading-none" aria-hidden="true">
        +
      </span>
      <span className="text-sm font-semibold">Add New Address</span>
    </button>
  );
}
