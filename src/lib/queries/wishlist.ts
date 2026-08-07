import { createClient } from "@/lib/supabase/client";

// A grid of N products (ProductGrid, FeaturedCollection) previously meant N
// identical getWishlistedProductIds(userId) calls firing in parallel on
// mount -- every card independently re-fetching the same full wishlist set.
// This caches the in-flight/resolved promise per user for a short window so
// a burst of card mounts collapses into one request, without touching any
// call site's API. Invalidated on every write (toggleWishlist) so a change
// is never masked by a stale cache.
let cache: { userId: string; promise: Promise<Set<string>>; timestamp: number } | null = null;
const CACHE_TTL_MS = 30_000;

export async function getWishlistedProductIds(userId: string): Promise<Set<string>> {
  const now = Date.now();
  if (cache && cache.userId === userId && now - cache.timestamp < CACHE_TTL_MS) {
    return cache.promise;
  }

  // Wrapped in an async IIFE rather than chaining .then() directly on the
  // query builder -- it returns a PromiseLike, not a real Promise, and
  // callers need the full Promise interface (this cache stores it directly).
  const promise = (async () => {
    const supabase = createClient();
    const { data } = await supabase.from("wishlists").select("product_id").eq("profile_id", userId);
    return new Set((data ?? []).map((row) => row.product_id));
  })();

  cache = { userId, promise, timestamp: now };
  return promise;
}

export async function toggleWishlist(userId: string, productId: string, isActive: boolean) {
  const supabase = createClient();
  if (isActive) {
    await supabase.from("wishlists").delete().eq("profile_id", userId).eq("product_id", productId);
  } else {
    await supabase.from("wishlists").insert({ profile_id: userId, product_id: productId });
  }
  // A stale cache would otherwise keep showing the pre-toggle heart state to
  // any card that mounts (or re-checks) before CACHE_TTL_MS elapses.
  cache = null;
}
