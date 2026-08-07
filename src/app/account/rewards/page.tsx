import { createClient } from "@/lib/supabase/server";
import { getSiteContent } from "@/lib/queries/site-content";
import { RewardsClient } from "@/components/account/rewards-client";

export const dynamic = "force-dynamic";

export default async function RewardsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null; // account/layout.tsx already redirects unauthenticated users

  const [{ data: profile }, { data: events }, { data: referralCode }, { data: leaderboard }, content] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("mango_credits, mango_lifetime_points")
        .eq("id", user.id)
        .single(),
      supabase
        .from("mango_game_events")
        .select("id, event_type, points, meta, created_at")
        .eq("profile_id", user.id)
        .order("created_at", { ascending: false })
        .limit(15),
      // Lazily generates the code on first visit here if the account
      // doesn't have one yet -- idempotent, so a repeat call just returns
      // the same one.
      supabase.rpc("get_or_create_referral_code"),
      supabase.rpc("get_mango_leaderboard"),
      getSiteContent(),
    ]);

  const lastCheckin = events?.find((e) => e.event_type === "daily_checkin");
  const todayUtc = new Date().toISOString().slice(0, 10);
  const checkedInToday = lastCheckin?.created_at.slice(0, 10) === todayUtc;
  const currentStreak = (lastCheckin?.meta as { streak?: number } | null)?.streak ?? 0;

  return (
    <RewardsClient
      mangoCredits={profile?.mango_credits ?? 0}
      lifetimePoints={profile?.mango_lifetime_points ?? 0}
      checkedInToday={checkedInToday}
      currentStreak={currentStreak}
      events={events ?? []}
      referralCode={referralCode ?? null}
      leaderboard={leaderboard ?? []}
      loyaltyContent={content.loyaltyProgram}
    />
  );
}
