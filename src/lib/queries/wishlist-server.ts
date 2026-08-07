import { createClient } from "@/lib/supabase/server";

export async function getWishlistPreviewForCurrentUser(limit = 4) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("wishlists")
    .select("created_at, product:products(id, slug, name, image, price, discount_price, status)")
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? [])
    .map((row) => row.product)
    .filter((p): p is NonNullable<typeof p> => Boolean(p) && p.status === "published");
}

export async function getFullWishlistForCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("wishlists")
    .select(
      "created_at, product:products(id, slug, name, image, price, discount_price, status, rating_avg, review_count)"
    )
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false });

  return (data ?? [])
    .map((row) => row.product)
    .filter((p): p is NonNullable<typeof p> => Boolean(p) && p.status === "published");
}
