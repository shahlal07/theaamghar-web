import { createClient } from "@/lib/supabase/client";

export async function getOrderByNumberClient(orderNumber: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .maybeSingle();
  return data;
}

/**
 * Tracking without an account: bypasses RLS via a security-definer RPC that
 * only matches when both the order number AND the email captured at
 * checkout are supplied -- lets a guest track an order even after losing
 * the session (real or anonymous) they checked out with.
 */
export async function getOrderByNumberAndEmailClient(orderNumber: string, email: string) {
  const supabase = createClient();
  const { data } = await supabase.rpc("find_order_by_number_and_email", {
    p_order_number: orderNumber,
    p_email: email,
  });
  return data?.[0] ?? null;
}
