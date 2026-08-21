import { createClient } from "@/lib/supabase/server";
import { getCurrentVendor } from "@/lib/tenant";

export async function getReviewsForCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const vendor = await getCurrentVendor();
  const { data } = await supabase
    .from("reviews")
    .select("id, rating, title, body, verified_purchase, created_at, product:products(id, slug, name, image)")
    .eq("vendor_id", vendor.id)
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getReviewsForProduct(productId: string) {
  const supabase = await createClient();
  const vendor = await getCurrentVendor();
  const { data, error } = await supabase
    .from("reviews")
    .select("id, rating, title, body, verified_purchase, created_at, images, taste_rating, freshness_rating, packaging_rating, delivery_rating, helpful_count, admin_reply_body, admin_reply_images, admin_reply_at, profile:profiles!reviews_profile_id_fkey(name)")
    .eq("vendor_id", vendor.id)
    .eq("product_id", productId)
    .order("created_at", { ascending: false });
  if (error) { console.error("getReviewsForProduct failed:", error); return []; }
  return data ?? [];
}

export async function getTopReviews(limit = 6) {
  const supabase = await createClient();
  const vendor = await getCurrentVendor();
  const { data, error } = await supabase
    .from("reviews")
    .select("id, rating, title, body, created_at, product:products(name, slug), profile:profiles!reviews_profile_id_fkey(name)")
    .eq("vendor_id", vendor.id)
    .gte("rating", 4)
    .not("body", "is", null)
    .order("helpful_count", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) { console.error("getTopReviews failed:", error); return []; }
  return data ?? [];
}

export async function getMyHelpfulVotedReviewIds(productReviewIds: string[]): Promise<Set<string>> {
  if (productReviewIds.length === 0) return new Set();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Set();
  const { data } = await supabase.from("review_helpful_votes").select("review_id").eq("profile_id", user.id).in("review_id", productReviewIds);
  return new Set((data ?? []).map((r) => r.review_id));
}
