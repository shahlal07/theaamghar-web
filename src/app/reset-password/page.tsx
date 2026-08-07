"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { safeRedirectPath } from "@/lib/safe-redirect";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = safeRedirectPath(searchParams.get("returnTo"));

  const [sessionReady, setSessionReady] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  // /auth/callback already exchanged the emailed link's code for a real
  // session before redirecting here, so this is just confirming that
  // succeeded -- not performing the exchange itself.
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => setSessionReady(Boolean(data.session)));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setSessionReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setPending(true);
    setError(null);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setPending(false);

    if (updateError) {
      setError("Something went wrong. Please request a new reset link and try again.");
      return;
    }

    router.push(returnTo);
  }

  if (sessionReady === null) return null;

  if (!sessionReady) {
    return (
      <div className="px-[5%] py-16 max-w-md mx-auto text-center">
        <h1 className="font-serif text-2xl font-bold mb-2">Link expired</h1>
        <p className="text-ink-light mb-6">
          This password reset link is invalid or has expired. Request a new one below.
        </p>
        <Link href="/forgot-password" className="text-mango-orange font-semibold">
          Send a new reset link
        </Link>
      </div>
    );
  }

  return (
    <div className="px-[5%] py-16 max-w-md mx-auto">
      <h1 className="font-serif text-3xl font-bold text-center mb-2">Set a New Password</h1>
      <p className="text-ink-light text-center mb-8">Choose a new password for your account.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="password" className="text-sm font-medium block mb-1">
            New Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-border-subtle rounded-brand-sm px-4 py-3 text-sm"
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
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-border-subtle rounded-brand-sm px-4 py-3 text-sm"
          />
        </div>
        {error && <p className="text-sm text-error">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="bg-mango-orange text-white font-semibold py-3.5 rounded-full disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save New Password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
