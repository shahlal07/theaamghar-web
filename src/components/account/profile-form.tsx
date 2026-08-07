"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileFormState } from "@/app/account/profile/actions";

export function ProfileForm({
  name,
  email,
  phone,
}: {
  name: string;
  email: string;
  phone: string;
}) {
  const [state, formAction, pending] = useActionState<ProfileFormState, FormData>(
    updateProfile,
    undefined
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label htmlFor="name" className="text-sm font-medium block mb-1">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={80}
          defaultValue={name}
          className="w-full border-[1.5px] border-border-subtle rounded-xl px-4 py-2.5 text-sm bg-surface focus-visible:outline-none focus-visible:border-mango-orange transition-colors"
        />
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-medium block mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          disabled
          className="w-full border-[1.5px] border-border-subtle rounded-xl px-4 py-2.5 text-sm bg-cream-warm text-ink-light"
        />
        <p className="text-xs text-ink-light mt-1">
          Contact support to change your email address.
        </p>
      </div>
      <div>
        <label htmlFor="phone" className="text-sm font-medium block mb-1">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="03XX-XXXXXXX"
          maxLength={20}
          defaultValue={phone}
          className="w-full border-[1.5px] border-border-subtle rounded-xl px-4 py-2.5 text-sm bg-surface focus-visible:outline-none focus-visible:border-mango-orange transition-colors"
        />
      </div>

      {state && "error" in state && <p className="text-sm text-error">{state.error}</p>}
      {state && "success" in state && (
        <p className="text-sm text-orchard-green">Profile updated ✓</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="self-start bg-mango-orange text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {pending ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
