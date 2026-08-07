"use client";

import { signOut } from "@/lib/actions/sign-out";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="text-sm font-semibold text-ink-light border border-border-subtle rounded-full px-5 py-2 hover:border-mango-orange hover:text-mango-orange"
      >
        Sign Out
      </button>
    </form>
  );
}
