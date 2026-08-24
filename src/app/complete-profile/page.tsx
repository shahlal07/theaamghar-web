"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthCenteredLayout } from "@/components/auth-centered-layout";
import { completeProfile } from "./actions";

function CompleteProfileForm() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "/account";
  const [state, formAction, pending] = useActionState(completeProfile, undefined);

  return (
    <AuthCenteredLayout>
      <div className="text-center mb-6">
        <h1 className="font-serif text-2xl font-bold mb-1.5">Add your phone number</h1>
        <p className="text-sm text-ink-light">Used for delivery updates only — never for signing in.</p>
      </div>

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
    </AuthCenteredLayout>
  );
}

export default function CompleteProfilePage() {
  return (
    <Suspense>
      <CompleteProfileForm />
    </Suspense>
  );
}
