"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthCenteredLayout } from "@/components/auth-centered-layout";
import { GoogleAuthButton, AuthDivider } from "@/components/google-auth-button";

const inputClass =
  "w-full border-[1.5px] border-border-subtle rounded-xl px-4 py-3 text-sm bg-surface focus-visible:outline-none focus-visible:border-mango-orange transition-colors";

function LoginForm() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "/account";
  const urlError = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (signInError) {
        setError("Incorrect email or password.");
        return;
      }
      // Full navigation (not router.push) so the server route reliably sees
      // the session cookies the browser client just wrote.
      window.location.href = `/auth/complete?returnTo=${encodeURIComponent(returnTo)}`;
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthCenteredLayout>
      <div className="text-center mb-6">
        <h1 className="font-serif text-2xl font-bold mb-1.5">Welcome back</h1>
        <p className="text-sm text-ink-light">Sign in to track orders and check out faster.</p>
      </div>

      {urlError === "account_belongs_to_another_store" && (
        <p className="mb-4 text-sm text-error text-center">
          That account belongs to another store. Please use the account you created here.
        </p>
      )}

      <GoogleAuthButton returnTo={returnTo} />

      <AuthDivider />

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
        <label className="block">
          <span className="text-sm font-medium block mb-1">Password</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </label>
        {error && <p className="text-sm text-error">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full bg-mango-orange text-white font-semibold py-3 rounded-full transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {pending ? "Signing in…" : "Continue with Email"}
        </button>
      </form>

      <p className="text-center text-sm text-ink-light mt-4">
        <Link href={`/forgot-password?returnTo=${encodeURIComponent(returnTo)}`} className="text-mango-orange font-semibold">
          Forgot password?
        </Link>
      </p>

      <p className="text-center text-sm text-ink-light mt-4">
        New here?{" "}
        <Link href={`/signup?returnTo=${encodeURIComponent(returnTo)}`} className="text-mango-orange font-semibold">
          Create an account
        </Link>
      </p>
    </AuthCenteredLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
