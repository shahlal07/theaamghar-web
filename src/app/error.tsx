"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import { logError } from "@/lib/log-error";

// Next.js 16 renamed the error boundary's retry prop to `unstable_retry`
// (was `reset` in older versions) -- see
// node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md

// A stale JS chunk reference (page open, or a slow/flaky connection's
// in-flight fetch, spanning a production deploy that replaced the build)
// fails with one of these -- unstable_retry() re-renders in place but can't
// fix it since the chunk URL itself is gone; only a real reload re-fetches
// the current build's HTML/JS. Checkout/tracking are exactly the pages a
// customer is most likely to hit this on mid-session.
function isChunkLoadError(error: Error): boolean {
  return (
    error.name === "ChunkLoadError" ||
    /Loading chunk [\d]+ failed|Failed to fetch dynamically imported module|Importing a module script failed/i.test(
      error.message
    )
  );
}

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    logError(error);
    if (isChunkLoadError(error)) {
      const key = "theaamghar_chunk_reload_attempted";
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, "1");
        window.location.reload();
      }
    }
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
          onClick={() => (isChunkLoadError(error) ? window.location.reload() : unstable_retry())}
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
