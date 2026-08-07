"use client";

import Link from "next/link";
import { Suspense, useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthSplitLayout } from "@/components/auth-split-layout";
import { PhoneAuthForm } from "@/components/phone-auth-form";
import { signup, type SignupState } from "./actions";

function SignupForm() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "/account";
  const [state, formAction, pending] = useActionState<SignupState, FormData>(signup, undefined);
  const [method, setMethod] = useState<"email" | "phone">("email");

  async function signInWithGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?returnTo=${encodeURIComponent(returnTo)}`,
      },
    });
  }

  if (state?.needsConfirmation) {
    return (
      <AuthSplitLayout
        eyebrow="TheAamGhar"
        headline="Fresh from the orchard, straight to your door."
        subhead="One more step and your account is ready — real orders, real orchards, real fast delivery."
      >
        <div className="text-center">
          <div className="text-4xl mb-4" aria-hidden="true">
            📬
          </div>
          <h1 className="font-serif text-2xl font-bold mb-2">Check your inbox</h1>
          <p className="text-ink-light">
            We&apos;ve sent a confirmation link to your email. Click it to activate your account
            and finish signing in.
          </p>
        </div>
      </AuthSplitLayout>
    );
  }

  return (
    <AuthSplitLayout
      eyebrow="TheAamGhar"
      headline="Fresh from the orchard, straight to your door."
      subhead="Create an account for faster checkout, order tracking, and a wishlist that's always there."
    >
      <h1 className="font-serif text-3xl font-bold text-center mb-2">
        Join <span className="text-mango-orange">TheAamGhar</span>
      </h1>
      <p className="text-ink-light text-center mb-6">
        Create an account for faster checkout and order tracking
      </p>

      <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-cream-warm rounded-full text-sm font-semibold">
        <button
          type="button"
          onClick={() => setMethod("email")}
          className={`py-2 rounded-full transition-colors ${
            method === "email" ? "bg-surface shadow-brand-sm text-ink" : "text-ink-light"
          }`}
        >
          Email
        </button>
        <button
          type="button"
          onClick={() => setMethod("phone")}
          className={`py-2 rounded-full transition-colors ${
            method === "phone" ? "bg-surface shadow-brand-sm text-ink" : "text-ink-light"
          }`}
        >
          Phone
        </button>
      </div>

      {method === "phone" ? (
        <PhoneAuthForm returnTo={returnTo} />
      ) : (
        <>
      <button
        type="button"
        onClick={signInWithGoogle}
        className="w-full flex items-center justify-center gap-2 border border-border-subtle rounded-full py-3 font-semibold text-sm mb-4 hover:border-mango-orange"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </button>

      <div className="flex items-center gap-3 my-5 text-xs text-ink-light">
        <div className="flex-1 h-px bg-border-subtle" />
        or
        <div className="flex-1 h-px bg-border-subtle" />
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="returnTo" value={returnTo} />
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
            className="w-full border border-border-subtle rounded-brand-sm px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium block mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full border border-border-subtle rounded-brand-sm px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-medium block mb-1">
            Phone (optional)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            maxLength={20}
            className="w-full border border-border-subtle rounded-brand-sm px-4 py-3 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="gender" className="text-sm font-medium block mb-1">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              className="w-full border border-border-subtle rounded-brand-sm px-4 py-3 text-sm bg-surface"
              defaultValue=""
            >
              <option value="">Prefer not to say</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="age" className="text-sm font-medium block mb-1">
              Age
            </label>
            <input
              id="age"
              name="age"
              type="number"
              min={13}
              max={120}
              className="w-full border border-border-subtle rounded-brand-sm px-4 py-3 text-sm"
            />
          </div>
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-medium block mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="w-full border border-border-subtle rounded-brand-sm px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="text-sm font-medium block mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={6}
            className="w-full border border-border-subtle rounded-brand-sm px-4 py-3 text-sm"
          />
        </div>
        {state?.error && <p className="text-sm text-error">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="bg-mango-orange text-white font-semibold py-3.5 rounded-full disabled:opacity-60"
        >
          {pending ? "Creating account…" : "Create Account"}
        </button>
      </form>
        </>
      )}

      <p className="text-center text-sm text-ink-light mt-6">
        Already have an account?{" "}
        <Link
          href={`/login?returnTo=${encodeURIComponent(returnTo)}`}
          className="text-mango-orange font-semibold"
        >
          Sign in
        </Link>
      </p>
    </AuthSplitLayout>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
