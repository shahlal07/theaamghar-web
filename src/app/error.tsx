"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import { logError } from "@/lib/log-error";

// Next.js 16 renamed the error boundary's retry prop to `unstable_retry`
// (was `reset` in older versions) -- see
// node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    logError(error);
  }, [error]);

  return (
    <div className="px-[5%] py-24 max-w-lg mx-auto text-center">
      <div className="text-6xl mb-6" aria-hidden="true">
        🍂
      </div>
      <h1 className="font-serif text-3xl font-bold mb-2">Something went wrong</h1>
      <p className="text-ink-light mb-8">
        We hit a snag loading this page. Please try again, or head back home.
      </p>
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={unstable_retry}
          className="bg-mango-orange text-white font-semibold px-8 py-3 rounded-full hover:-translate-y-0.5 transition-transform"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="border border-border-subtle font-semibold px-8 py-3 rounded-full hover:border-mango-orange hover:text-mango-orange"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
