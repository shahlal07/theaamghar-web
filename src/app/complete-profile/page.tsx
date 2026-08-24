"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthSplitLayout } from "@/components/auth-split-layout";
import { completeProfile } from "./actions";

function CompleteProfileForm() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "/account";
  const [state, formAction, pending] = useActionState(completeProfile, undefined);

  return (
    <AuthSplitLayout
      eyebrow="Nashemann"
      headline="One last thing."
      subhead="We need a phone number on file so the store can reach you about your orders. You won't need it to sign in again."
    >
      <h1 className="font-serif text-3xl font-bold text-center mb-2">Add your phone number</h1>
      <p className="text-ink-light text-center mb-6">Used for delivery updates only — never for signing in.</p>

      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="returnTo" value={returnTo} />
        <div>
          <label htmlFor="phone" className="text-sm font-medium block mb-1">
            Mobile Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoFocus
            placeholder="0300-1234567"
            className="w-full border border-border-subtle rounded-brand-sm px-4 py-3 text-sm"
          />
        </div>
        {state?.error && <p className="text-sm text-error">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="bg-mango-orange text-white font-semibold py-3.5 rounded-full disabled:opacity-60"
        >
          {pending ? "Saving…" : "Continue"}
        </button>
      </form>
    </AuthSplitLayout>
  );
}

export default function CompleteProfilePage() {
  return (
    <Suspense>
      <CompleteProfileForm />
    </Suspense>
  );
}
