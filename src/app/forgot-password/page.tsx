"use client";

import Link from "next/link";
import { Suspense, useSearchParams } from "next/navigation";

function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "/account";

  return (
    <div className="px-[5%] py-16 max-w-md mx-auto text-center">
      <div className="text-4xl mb-4" aria-hidden="true">📱</div>
      <h1 className="font-serif text-3xl font-bold mb-3">No password to reset</h1>
      <p className="text-ink-light">
        Nashemann customer accounts now use phone verification or Google sign-in instead of email passwords.
        Request a new one-time code from the sign-in page.
      </p>
      <Link
        href={`/login?returnTo=${encodeURIComponent(returnTo)}`}
        className="bg-mango-orange text-white font-semibold py-3 px-6 rounded-full inline-block mt-7"
      >
        Sign in with phone or Google
      </Link>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return <Suspense><ForgotPasswordForm /></Suspense>;
}
