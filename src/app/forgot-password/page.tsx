"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthCenteredLayout } from "@/components/auth-centered-layout";

const inputClass =
  "w-full border-[1.5px] border-border-subtle rounded-xl px-4 py-3 text-sm bg-surface focus-visible:outline-none focus-visible:border-mango-orange transition-colors";

function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "/account";
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    try {
      const supabase = createClient();
      // The emailed link carries a code, so it has to land on /auth/callback
      // to be exchanged for a session before /reset-password can update the
      // password (that page assumes the exchange already happened).
      await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/auth/callback?returnTo=${encodeURIComponent("/reset-password")}`,
      });
      // Always report success regardless of whether the address exists --
      // telling the difference would let anyone enumerate which emails have
      // accounts on this store.
      setSent(true);
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <AuthCenteredLayout>
        <div className="text-center">
          <h1 className="font-serif text-2xl font-bold mb-2">Check your email</h1>
          <p className="text-sm text-ink-light">
            If an account exists for that address, we&apos;ve sent a link to reset your password.
          </p>
          <Link
            href={`/login?returnTo=${encodeURIComponent(returnTo)}`}
            className="text-mango-orange font-semibold text-sm inline-block mt-6"
          >
            Back to sign in
          </Link>
        </div>
      </AuthCenteredLayout>
    );
  }

  return (
    <AuthCenteredLayout>
      <div className="text-center mb-6">
        <h1 className="font-serif text-2xl font-bold mb-1.5">Reset your password</h1>
        <p className="text-sm text-ink-light">We&apos;ll email you a link to set a new one.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="block">
          <span className="text-sm font-medium block mb-1">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClass}
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="w-full bg-mango-orange text-white font-semibold py-3 rounded-full transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {pending ? "Sending…" : "Send reset link"}
        </button>
      </form>

      <p className="text-center text-sm text-ink-light mt-6">
        Remembered it?{" "}
        <Link href={`/login?returnTo=${encodeURIComponent(returnTo)}`} className="text-mango-orange font-semibold">
          Sign in
        </Link>
      </p>
    </AuthCenteredLayout>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ForgotPasswordForm />
    </Suspense>
  );
}
