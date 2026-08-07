"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ReviewFormState = { error: string } | { success: true } | undefined;

export async function updateOwnReview(
  reviewId: string,
  _prev: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in." };

  const rating = Number(formData.get("rating"));
  const title = String(formData.get("title") ?? "").trim().slice(0, 120);
  const body = String(formData.get("body") ?? "").trim().slice(0, 2000);

  if (rating < 1 || rating > 5 || !body) {
    return { error: "Please provide a rating and a review." };
  }

  // RLS ("customers update own reviews") scopes this to the owner already;
  // .eq("profile_id", ...) is defense in depth.
  const { error } = await supabase
    .from("reviews")
    .update({ rating, title: title || null, body })
    .eq("id", reviewId)
    .eq("profile_id", user.id);

  if (error) return { error: "Something went wrong saving your review. Please try again." };

  revalidatePath("/account/reviews");
  return { success: true };
}

export async function deleteOwnReview(reviewId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("reviews").delete().eq("id", reviewId).eq("profile_id", user.id);
  revalidatePath("/account/reviews");
}
