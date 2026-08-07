"use client";

import { useActionState, useEffect } from "react";
import { PAKISTAN_PROVINCES } from "@/lib/queries/shipping";
import { addAddress, updateAddress, type AddressFormState } from "@/app/account/addresses/actions";
import type { Tables } from "@/lib/supabase/types";

export function AddressFormPanel({
  existing,
  onDone,
}: {
  existing?: Tables<"addresses">;
  onDone: () => void;
}) {
  const action = existing ? updateAddress.bind(null, existing.id) : addAddress;
  const [state, formAction, pending] = useActionState<AddressFormState, FormData>(action, undefined);

  useEffect(() => {
    if (state && "success" in state) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form
      action={formAction}
      className="bg-surface border-2 border-mango-orange/30 rounded-brand p-5 flex flex-col gap-3"
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <TextField id="label" name="label" label="Label" placeholder="Home, Office, Gift…" defaultValue={existing?.label ?? ""} maxLength={40} />
        <TextField id="phone" name="phone" label="Phone (optional)" type="tel" placeholder="03XX-XXXXXXX" defaultValue={existing?.phone ?? ""} maxLength={20} />
      </div>

      <div>
        <label htmlFor="address" className="text-sm font-medium block mb-1">
          Street Address
        </label>
        <textarea
          id="address"
          name="address"
          required
          maxLength={200}
          rows={2}
          defaultValue={existing?.address ?? ""}
          className="w-full border border-border-subtle rounded-brand-sm px-3 py-2 text-sm"
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label htmlFor="province" className="text-sm font-medium block mb-1">
            Province
          </label>
          <select
            id="province"
            name="province"
            required
            defaultValue={existing?.province ?? ""}
            className="w-full border border-border-subtle rounded-brand-sm px-3 py-2 text-sm bg-surface"
          >
            <option value="">Select…</option>
            {PAKISTAN_PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <TextField id="city" name="city" label="City" defaultValue={existing?.city ?? ""} maxLength={60} required />
        <TextField id="postalCode" name="postalCode" label="Postal Code" defaultValue={existing?.postal_code ?? ""} maxLength={10} />
      </div>

      {state && "error" in state && <p className="text-sm text-error">{state.error}</p>}

      <div className="flex gap-2 mt-1">
        <button
          type="submit"
          disabled={pending}
          className="bg-mango-orange text-white text-sm font-semibold px-6 py-2.5 rounded-full disabled:opacity-60"
        >
          {pending ? "Saving…" : existing ? "Save Changes" : "Add Address"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="text-sm font-semibold text-ink-light border border-border-subtle rounded-full px-6 py-2.5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function TextField({
  id,
  name,
  label,
  type = "text",
  required,
  maxLength,
  placeholder,
  defaultValue,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium block mb-1">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        maxLength={maxLength}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full border border-border-subtle rounded-brand-sm px-3 py-2 text-sm"
      />
    </div>
  );
}
