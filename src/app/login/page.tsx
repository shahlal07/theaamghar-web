"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthSplitLayout } from "@/components/auth-split-layout";
import { PhoneAuthForm } from "@/components/phone-auth-form";

function LoginForm() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "/account";

  async function signInWithGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?returnTo=${encodeURIComponent(returnTo)}`,
      },
    });
  }

  return (
    <AuthSplitLayout
      eyebrow="Nashemann"
      headline="One account for every shop you love."
      subhead="Sign in with your phone or Google to track orders, manage your wishlist, and keep your store experience private to the shop you are using."
    >
      <h1 className="font-serif text-3xl font-bold text-center mb-2">Welcome Back</h1>
      <p className="text-ink-light text-center mb-6">Choose a secure passwordless sign-in method.</p>

      <button
        type="button"
        onClick={signInWithGoogle}
        className="w-full flex items-center justify-center gap-2 border border-border-subtle rounded-full py-3 font-semibold text-sm mb-5 hover:border-mango-orange"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </button>

      <div className="flex items-center gap-3 my-5 text-xs text-ink-light">
        <div className="flex-1 h-px bg-border-subtle" />
        or use your phone
        <div className="flex-1 h-px bg-border-subtle" />
      </div>

      <PhoneAuthForm returnTo={returnTo} />

      <p className="text-center text-sm text-ink-light mt-6">
        New here?{" "}
        <Link href={`/signup?returnTo=${encodeURIComponent(returnTo)}`} className="text-mango-orange font-semibold">Create an account</Link>
      </p>
    </AuthSplitLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
