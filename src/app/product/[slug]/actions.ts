"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const MAX_IMAGES = 4;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
// Explicit allowlist, not a "starts with image/" prefix check -- the latter
// let file.type (client-declared, spoofable in a raw multipart request)
// through for image/svg+xml, which can embed a <script> tag. If a public
// review-images storage URL is ever opened directly rather than via <img>,
// that's stored XSS. Matches the allowlist already used for payment
// proofs and bug-report screenshots.
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function submitReview(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be signed in to leave a review." };
  }

  const productId = String(formData.get("productId") ?? "");
  const productSlug = String(formData.get("productSlug") ?? "");
  const rating = Number(formData.get("rating"));
  const title = String(formData.get("title") ?? "").trim().slice(0, 120);
  const body = String(formData.get("body") ?? "").trim().slice(0, 2000);

  // Sub-ratings are optional -- 0/empty means "not rated", stored as null,
  // not coerced to a real 1-5 value the customer never actually chose.
  const subRating = (field: string) => {
    const raw = Number(formData.get(field));
    return raw >= 1 && raw <= 5 ? raw : null;
  };

  if (!productId || rating < 1 || rating > 5 || !body) {
    return { error: "Please provide a rating and a review." };
  }

  const imageFiles = formData
    .getAll("images")
    .filter((f): f is File => f instanceof File && f.size > 0)
    .slice(0, MAX_IMAGES);

  for (const file of imageFiles) {
    if (file.size > MAX_IMAGE_BYTES) {
      return { error: `${file.name} is too large -- please keep images under 5MB.` };
    }
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return { error: "Please upload a JPG, PNG or WebP image." };
    }
  }

  const imageUrls: string[] = [];
  for (const file of imageFiles) {
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("review-images")
      .upload(path, file, { contentType: file.type });
    if (uploadError) continue; // best-effort -- one failed upload shouldn't block the whole review
    const { data: publicUrl } = supabase.storage.from("review-images").getPublicUrl(path);
    imageUrls.push(publicUrl.publicUrl);
  }

  const { data: inserted, error } = await supabase
    .from("reviews")
    .insert({
      product_id: productId,
      profile_id: user.id,
      rating,
      title: title || null,
      body,
      images: imageUrls,
      taste_rating: subRating("tasteRating"),
      freshness_rating: subRating("freshnessRating"),
      packaging_rating: subRating("packagingRating"),
      delivery_rating: subRating("deliveryRating"),
    })
    .select("id")
    .single();

  if (error) {
    // Unique constraint on (product_id, profile_id) -- one review per customer per product.
    if (error.code === "23505") {
      return { error: "You've already reviewed this product." };
    }
    return { error: "Something went wrong submitting your review. Please try again." };
  }

  // Mango rewards points -- best-effort, never blocks the review itself.
  // The RPC is idempotent per review_id, so this is also safe to retry.
  if (inserted) {
    await supabase.rpc("award_review_points", { p_review_id: inserted.id });
  }

  revalidatePath(`/product/${productSlug}`);
  revalidatePath("/account/rewards");
  return { success: true };
}
