import { createClient } from "@/lib/supabase/server";

export type BugReport = {
  id: string;
  title: string;
  description: string;
  status: string;
  ai_reply: string | null;
  admin_note: string | null;
  reward_granted: boolean;
  created_at: string;
};

export async function getBugReportsForCurrentUser(): Promise<BugReport[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("bug_reports")
    .select("id, title, description, status, ai_reply, admin_note, reward_granted, created_at")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getMangoCreditsForCurrentUser(): Promise<number> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;

  const { data } = await supabase
    .from("profiles")
    .select("mango_credits")
    .eq("id", user.id)
    .maybeSingle();

  return data?.mango_credits ?? 0;
}
