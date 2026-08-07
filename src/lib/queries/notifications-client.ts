import { createClient } from "@/lib/supabase/client";

// Count only -- head:true means PostgREST returns the count without shipping
// any rows, since the navbar bell only needs the number. RLS already scopes
// customer_notifications to the caller, so no extra filtering is needed
// beyond `read = false`.
export async function getUnreadNotificationCount(): Promise<number> {
  const supabase = createClient();
  const { count } = await supabase
    .from("customer_notifications")
    .select("id", { count: "exact", head: true })
    .eq("read", false);
  return count ?? 0;
}

export async function markNotificationRead(id: string) {
  const supabase = createClient();
  await supabase.from("customer_notifications").update({ read: true }).eq("id", id);
}

export async function markAllNotificationsRead(profileId: string) {
  const supabase = createClient();
  await supabase
    .from("customer_notifications")
    .update({ read: true })
    .eq("profile_id", profileId)
    .eq("read", false);
}
