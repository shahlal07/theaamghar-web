import { createClient } from "@/lib/supabase/server";

// RLS ("customers read own orders, admins read all") is what actually
// enforces ownership here -- an unauthenticated or non-owning request
// simply gets zero rows back, not an error. This is the fix for the
// audit's original finding that any order number, known or guessed,
// revealed a stranger's name/address/phone.
export async function getOrderByNumber(orderNumber: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .maybeSingle();
  return data;
}

export async function getOrdersForCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  return data ?? [];
}

export async function getGiftOrdersForCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("orders")
    .select("*")
    .eq("is_gift", true)
    .order("created_at", { ascending: false })
    .limit(20);

  return data ?? [];
}

export async function getAddressesForCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("addresses")
    .select("*")
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  return data ?? [];
}

// Used by the orders page to decide whether to show "Leave a Review" per
// delivered line item -- a product the customer already reviewed shows
// "Edit Review" instead. One query for all orders rather than N+1 per card.
export async function getReviewedProductIdsForCurrentUser(): Promise<Set<string>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Set();

  const { data } = await supabase
    .from("reviews")
    .select("product_id")
    .eq("profile_id", user.id);

  return new Set((data ?? []).map((r) => r.product_id));
}
