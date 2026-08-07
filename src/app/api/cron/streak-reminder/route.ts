import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { sendStreakReminderEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

type StreakEvent = { profile_id: string; created_at: string; meta: unknown };

/**
 * Runs daily via Vercel Cron (see vercel.json). Finds customers whose most
 * recent daily_checkin was exactly yesterday (UTC) with a streak of 2+ --
 * meaning if they don't check in again today, the streak resets -- and
 * emails a reminder. Requires the service-role key since this needs to
 * read across every customer's rows, not just the caller's own (there is
 * no caller; this is an unauthenticated scheduled job, gated by
 * CRON_SECRET instead of a user session).
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }
  const supabase = createServiceClient(url, serviceKey);

  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
  const { data: events, error } = await supabase
    .from("mango_game_events")
    .select("profile_id, created_at, meta")
    .eq("event_type", "daily_checkin")
    .gte("created_at", twoDaysAgo)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }

  // First (most recent, thanks to the ordering above) event per profile.
  const latestByProfile = new Map<string, StreakEvent>();
  for (const e of events ?? []) {
    if (!latestByProfile.has(e.profile_id)) latestByProfile.set(e.profile_id, e);
  }

  const yesterdayUtc = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const candidateIds: string[] = [];
  for (const [profileId, e] of latestByProfile) {
    const day = e.created_at.slice(0, 10);
    const streak = (e.meta as { streak?: number } | null)?.streak ?? 0;
    if (day === yesterdayUtc && streak >= 2) candidateIds.push(profileId);
  }

  if (candidateIds.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, name, email")
    .in("id", candidateIds);

  let sent = 0;
  for (const p of profiles ?? []) {
    if (!p.email) continue;
    const streak = (latestByProfile.get(p.id)?.meta as { streak?: number } | null)?.streak ?? 0;
    await sendStreakReminderEmail({ to: p.email, name: p.name ?? "there", streak });
    sent++;
  }

  return NextResponse.json({ sent });
}
