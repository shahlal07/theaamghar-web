import { createClient } from "@/lib/supabase/server";

export async function getUnreadNotificationCount() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count } = await supabase
    .from("customer_notifications")
    .select("id", { count: "exact", head: true })
    .eq("read", false);

  return count ?? 0;
}

export async function getNotificationsForCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("customer_notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return data ?? [];
}
