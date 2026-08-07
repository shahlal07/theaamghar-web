"use client";

import { useState, useTransition } from "react";
import { deleteAddress, setDefaultAddress } from "@/app/account/addresses/actions";
import { AddressFormPanel } from "@/components/account/address-form-panel";
import { googleMapsUrl } from "@/lib/maps";
import type { Tables } from "@/lib/supabase/types";

const LABEL_ICONS: Record<string, string> = {
  home: "🏠",
  office: "🏢",
  gift: "🎁",
};

export function AddressCard({ address }: { address: Tables<"addresses"> }) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const icon = LABEL_ICONS[address.label?.toLowerCase() ?? ""] ?? "📍";

  if (editing) {
    return <AddressFormPanel existing={address} onDone={() => setEditing(false)} />;
  }

  return (
    <div
      className={`relative bg-surface border-[1.5px] rounded-2xl p-5 ${
        address.is_default ? "border-mango-orange shadow-brand-sm" : "border-border-subtle"
      }`}
    >
      {address.is_default && (
        <span className="absolute -top-2.5 left-4 bg-mango-orange text-white text-[0.65rem] font-bold px-2.5 py-0.5 rounded-full">
          Default
        </span>
      )}
      <div className="flex items-center gap-2 mb-2">
        <span aria-hidden="true">{icon}</span>
        <span className="font-semibold text-sm">{address.label ?? address.city}</span>
      </div>
      <p className="text-sm text-ink-light">
        {address.address}
        <br />
        {address.city}
        {address.province ? `, ${address.province}` : ""}
        {address.postal_code ? ` ${address.postal_code}` : ""}
      </p>
      {address.phone && <div className="text-xs text-ink-light mt-1.5">📞 {address.phone}</div>}
      <a
        href={googleMapsUrl(address.address, address.city, address.province)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-xs font-semibold text-mango-orange mt-1.5"
      >
        View on Google Maps ↗
      </a>

      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border-subtle">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-xs font-semibold text-ink border border-border-subtle rounded-full px-3.5 py-1.5 hover:border-mango-orange hover:text-mango-orange"
        >
          Edit
        </button>
        {!address.is_default && (
          <button
            type="button"
            disabled={pending}
            onClick={() => startTransition(() => setDefaultAddress(address.id))}
            className="text-xs font-semibold text-ink border border-border-subtle rounded-full px-3.5 py-1.5 hover:border-orchard-green hover:text-orchard-green disabled:opacity-60"
          >
            Set as Default
          </button>
        )}
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (confirm("Remove this address?")) {
              startTransition(() => deleteAddress(address.id));
            }
          }}
          className="text-xs font-semibold text-ink-light border border-border-subtle rounded-full px-3.5 py-1.5 hover:border-error hover:text-error disabled:opacity-60 ml-auto"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
