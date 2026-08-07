"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "/account";

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?returnTo=${encodeURIComponent(
        `/reset-password?returnTo=${encodeURIComponent(returnTo)}`
      )}`,
    });

    // Supabase returns success here even for an email with no account (by
    // design, to avoid leaking which emails are registered) -- so a real
    // `error` only surfaces genuine failures like rate-limiting, and those
    // are the only case that should break from the "sent" confirmation.
    setStatus(error ? "error" : "sent");
  }

  if (status === "sent") {
    return (
      <div className="px-[5%] py-16 max-w-md mx-auto text-center">
        <div className="text-4xl mb-4" aria-hidden="true">
          📬
        </div>
        <h1 className="font-serif text-2xl font-bold mb-2">Check your inbox</h1>
        <p className="text-ink-light">
          If an account exists for <span className="font-semibold">{email}</span>, we&apos;ve sent
          a link to reset your password. It may take a minute to arrive.
        </p>
        <Link href="/login" className="text-mango-orange font-semibold text-sm mt-6 inline-block">
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="px-[5%] py-16 max-w-md mx-auto">
      <h1 className="font-serif text-3xl font-bold text-center mb-2">Reset Your Password</h1>
      <p className="text-ink-light text-center mb-8">
        Enter the email on your account and we&apos;ll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="text-sm font-medium block mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-border-subtle rounded-brand-sm px-4 py-3 text-sm"
          />
        </div>
        {status === "error" && (
          <p className="text-sm text-error">
            Something went wrong sending the reset link. Please try again in a moment.
          </p>
        )}
        <button
          type="submit"
          disabled={status === "sending"}
          className="bg-mango-orange text-white font-semibold py-3.5 rounded-full disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send Reset Link"}
        </button>
      </form>

      <p className="text-center text-sm text-ink-light mt-6">
        Remembered your password?{" "}
        <Link
          href={`/login?returnTo=${encodeURIComponent(returnTo)}`}
          className="text-mango-orange font-semibold"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ForgotPasswordForm />
    </Suspense>
  );
}
