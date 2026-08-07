import { createClient } from "@/lib/supabase/server";

export async function getReviewsForCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("reviews")
    .select("id, rating, title, body, verified_purchase, created_at, product:products(id, slug, name, image)")
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getReviewsForProduct(productId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    // Explicit FK name required: adding review_helpful_votes (which also
    // has a path to profiles) made the plain `profiles(name)` embed
    // ambiguous -- PostgREST rejects it outright (PGRST201) rather than
    // guessing, which silently returned an empty review list everywhere
    // until this was pinned down with the real error surfaced below.
    .select(
      "id, rating, title, body, verified_purchase, created_at, images, taste_rating, freshness_rating, packaging_rating, delivery_rating, helpful_count, admin_reply_body, admin_reply_images, admin_reply_at, profile:profiles!reviews_profile_id_fkey(name)"
    )
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getReviewsForProduct failed:", error);
    return [];
  }
  return data ?? [];
}

// Real customer testimonials for the homepage -- highest-rated reviews with
// actual written feedback, most helpful first. Returns whatever's genuinely
// there (today: very few, since the store is early) rather than padding
// with seed/fake content; the Testimonials section itself handles a sparse
// or empty result gracefully.
export async function getTopReviews(limit = 6) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select(
      "id, rating, title, body, created_at, product:products(name, slug), profile:profiles!reviews_profile_id_fkey(name)"
    )
    .gte("rating", 4)
    .not("body", "is", null)
    .order("helpful_count", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getTopReviews failed:", error);
    return [];
  }
  return data ?? [];
}

export async function getMyHelpfulVotedReviewIds(productReviewIds: string[]): Promise<Set<string>> {
  if (productReviewIds.length === 0) return new Set();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Set();

  const { data } = await supabase
    .from("review_helpful_votes")
    .select("review_id")
    .eq("profile_id", user.id)
    .in("review_id", productReviewIds);

  return new Set((data ?? []).map((r) => r.review_id));
}
