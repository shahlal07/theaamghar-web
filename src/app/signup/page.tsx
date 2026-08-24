"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthCenteredLayout } from "@/components/auth-centered-layout";
import { GoogleAuthButton, AuthDivider } from "@/components/google-auth-button";

const TERMS_URL = "https://nashemann.store/terms";
const inputClass =
  "w-full border-[1.5px] border-border-subtle rounded-xl px-4 py-3 text-sm bg-surface focus-visible:outline-none focus-visible:border-mango-orange transition-colors";

function SignupForm() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "/account";
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setNotice("");
    if (!agreedToTerms) {
      setError("Please agree to the Terms & Conditions to continue.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setPending(true);
    try {
      const supabase = createClient();
      const cleanEmail = email.trim().toLowerCase();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?returnTo=${encodeURIComponent(returnTo)}`,
        },
      });
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      // With email confirmation ON, signUp returns a user but no session --
      // the customer has to click the emailed link. With it OFF, a session
      // exists immediately and we can continue straight through.
      if (data.session) {
        window.location.href = `/auth/complete?returnTo=${encodeURIComponent(returnTo)}`;
        return;
      }
      setNotice(`Almost there — we sent a confirmation link to ${cleanEmail}. Open it to finish creating your account.`);
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthCenteredLayout>
      <div className="text-center mb-6">
        <h1 className="font-serif text-2xl font-bold mb-1.5">Create your account</h1>
        <p className="text-sm text-ink-light">Use Google, or sign up with an email and password.</p>
      </div>

      <GoogleAuthButton returnTo={returnTo} disabled={!agreedToTerms} />

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
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium block mb-1">Confirm password</span>
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="flex items-start gap-2.5 text-xs text-ink-light mt-1">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => {
              setAgreedToTerms(e.target.checked);
              setError("");
            }}
            className="mt-0.5 h-4 w-4 shrink-0 accent-mango-orange"
          />
          <span>
            I agree to Nashemann&apos;s{" "}
            <a href={TERMS_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-mango-orange hover:underline">
              Terms &amp; Conditions
            </a>
            .
          </span>
        </label>

        {error && <p className="text-sm text-error">{error}</p>}
        {notice && <p className="text-sm text-orchard-green">{notice}</p>}

        <button
          type="submit"
          disabled={pending || !agreedToTerms}
          className="w-full bg-mango-orange text-white font-semibold py-3 rounded-full transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {pending ? "Creating account…" : "Continue with Email"}
        </button>
      </form>

      <p className="text-center text-sm text-ink-light mt-6">
        Already have an account?{" "}
        <Link href={`/login?returnTo=${encodeURIComponent(returnTo)}`} className="text-mango-orange font-semibold">
          Sign in
        </Link>
      </p>
    </AuthCenteredLayout>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
