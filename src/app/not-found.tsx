import Link from "next/link";
import { getSiteContent } from "@/lib/queries/site-content";

export default async function NotFound() {
  const { brand, emptyStates } = await getSiteContent();

  return (
    <div className="px-[5%] py-24 max-w-lg mx-auto text-center">
      <div className="text-6xl mb-6" aria-hidden="true">
        {brand.accentEmoji}
      </div>
      <h1 className="font-serif text-3xl font-bold mb-2">{emptyStates.notFoundTitle}</h1>
      <p className="text-ink-light mb-8">{emptyStates.notFoundBody}</p>
      <Link
        href="/"
        className="inline-block bg-mango-orange text-white font-semibold px-8 py-3 rounded-full hover:-translate-y-0.5 transition-transform"
      >
        Back to Home
      </Link>
    </div>
  );
}
