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
 * only matches when both the order number AND a contact value (the email
 * OR the phone number captured at checkout, either works) are supplied --
 * lets a guest track an order even after losing the session (real or
 * anonymous) they checked out with. Phone comparison is digit-normalized
 * server-side, so "+92 321 9876543" and "03219876543" both match.
 */
export async function getOrderByNumberAndContactClient(orderNumber: string, contact: string) {
  const supabase = createClient();
  const { data } = await supabase.rpc("find_order_by_number_and_contact", {
    p_order_number: orderNumber,
    p_contact: contact,
  });
  return data?.[0] ?? null;
}

/**
 * Tracking by email/phone alone, no order number needed -- returns the
 * guest's single most recent order matching that contact. Same
 * digit-normalized phone matching as getOrderByNumberAndContactClient.
 */
export async function getLatestOrderByContactClient(contact: string) {
  const supabase = createClient();
  const { data } = await supabase.rpc("find_latest_order_by_contact", { p_contact: contact });
  return data?.[0] ?? null;
}
