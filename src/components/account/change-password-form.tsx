"use client";

import { useActionState } from "react";
import { changePassword, type PasswordFormState } from "@/app/account/settings/actions";

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState<PasswordFormState, FormData>(
    changePassword,
    undefined
  );

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-sm">
      <div>
        <label htmlFor="newPassword" className="text-sm font-medium block mb-1">
          New Password
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          minLength={6}
          className="w-full border border-border-subtle rounded-brand-sm px-4 py-2.5 text-sm"
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="text-sm font-medium block mb-1">
          Confirm New Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={6}
          className="w-full border border-border-subtle rounded-brand-sm px-4 py-2.5 text-sm"
        />
      </div>
      {state && "error" in state && <p className="text-sm text-error">{state.error}</p>}
      {state && "success" in state && (
        <p className="text-sm text-orchard-green">Password updated ✓</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="self-start bg-mango-orange text-white text-sm font-semibold px-6 py-2.5 rounded-full disabled:opacity-60"
      >
        {pending ? "Updating…" : "Update Password"}
      </button>
    </form>
  );
}
