"use client";

import { useActionState, useState } from "react";
import { checkIn, redeem } from "@/app/account/rewards/actions";
import { getLevelInfo, MANGO_REWARD_TIERS } from "@/lib/mango-levels";
import type { SiteContent } from "@/lib/queries/site-content";

type LoyaltyContent = SiteContent["loyaltyProgram"];

type GameEvent = {
  id: string;
  event_type: string;
  points: number;
  meta: unknown;
  created_at: string;
};

const EVENT_LABELS: Record<string, string> = {
  daily_checkin: "Daily check-in",
  review: "Left a review",
  redeem: "Redeemed reward",
};

function eventLabel(e: GameEvent): string {
  if (e.event_type === "referral") {
    const role = (e.meta as { role?: string } | null)?.role;
    return role === "referrer" ? "Friend you referred ordered" : "Signed up via referral";
  }
  return EVENT_LABELS[e.event_type] ?? e.event_type;
}

function CheckInCard({
  checkedInToday,
  currentStreak,
  loyalty,
}: {
  checkedInToday: boolean;
  currentStreak: number;
  loyalty: LoyaltyContent;
}) {
  const [state, formAction, pending] = useActionState(async () => checkIn(), undefined);
  const alreadyToday = checkedInToday && !(state && "success" in state);

  return (
    <div className="bg-surface border border-border-subtle rounded-brand p-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-serif font-bold text-lg mb-1">Daily Check-In</h2>
          <p className="text-sm text-ink-light">
            {currentStreak > 0
              ? `${currentStreak} day streak — keep it going for bigger bonuses.`
              : "Check in daily to start a streak and earn bonus points."}
          </p>
        </div>
        <form action={formAction}>
          <button
            type="submit"
            disabled={pending || alreadyToday}
            className="bg-mango-orange text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 whitespace-nowrap"
          >
            {alreadyToday ? "Checked in today ✓" : pending ? "Checking in…" : `${loyalty.emoji} Check In`}
          </button>
        </form>
      </div>
      {state && "error" in state && <p className="text-sm text-error mt-3">{state.error}</p>}
      {state && "success" in state && (
        <p className="text-sm text-orchard-green mt-3">
          +{state.points} {state.points === 1 ? loyalty.currencySingular : loyalty.currencyPlural}! Day{" "}
          {state.streak} streak.
        </p>
      )}
    </div>
  );
}

function ReferralCard({ referralCode, loyalty }: { referralCode: string | null; loyalty: LoyaltyContent }) {
  const [copied, setCopied] = useState(false);
  const shareUrl =
    referralCode && typeof window !== "undefined"
      ? `${window.location.origin}/signup?ref=${referralCode}`
      : null;

  async function handleCopy() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked -- the link is still visible on screen to copy manually.
    }
  }

  return (
    <div className="bg-surface border border-border-subtle rounded-brand p-6">
      <h2 className="font-serif font-bold text-lg mb-1">Invite Friends</h2>
      <p className="text-sm text-ink-light mb-4">
        Share your link — you get 100 {loyalty.currencyPlural} and they get 50 when their first
        order ships.
      </p>
      <div className="flex flex-wrap gap-2">
        <input
          readOnly
          value={shareUrl ?? "Loading…"}
          onFocus={(e) => e.currentTarget.select()}
          className="flex-1 min-w-[200px] border border-border-subtle rounded-brand-sm px-4 py-2.5 text-sm bg-cream-warm text-ink-light"
        />
        <button
          type="button"
          onClick={handleCopy}
          disabled={!shareUrl}
          className="bg-mango-orange text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          {copied ? "Copied ✓" : "Copy Link"}
        </button>
      </div>
    </div>
  );
}

type LeaderboardEntry = { display_name: string; lifetime_points: number; rank: number };

function LeaderboardCard({ entries, loyalty }: { entries: LeaderboardEntry[]; loyalty: LoyaltyContent }) {
  if (entries.length === 0) return null;

  return (
    <div className="bg-surface border border-border-subtle rounded-brand p-6">
      <h2 className="font-serif font-bold text-lg mb-1">Top {loyalty.currencyTitleCase} Collectors</h2>
      <p className="text-sm text-ink-light mb-4">All-time top {loyalty.currencySingular} earners.</p>
      <ol className="flex flex-col gap-2">
        {entries.map((e) => (
          <li
            key={e.rank}
            className="flex items-center justify-between text-sm py-2 border-b border-border-subtle last:border-b-0"
          >
            <span className="flex items-center gap-2">
              <span className="w-6 text-ink-light font-mono">
                {e.rank <= 3 ? ["🥇", "🥈", "🥉"][e.rank - 1] : `#${e.rank}`}
              </span>
              <span>{e.display_name}</span>
            </span>
            <span className="font-semibold text-mango-orange">{e.lifetime_points} pts</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function RewardsClient({
  mangoCredits,
  lifetimePoints,
  checkedInToday,
  currentStreak,
  events,
  referralCode,
  leaderboard,
  loyaltyContent,
}: {
  mangoCredits: number;
  lifetimePoints: number;
  checkedInToday: boolean;
  currentStreak: number;
  events: GameEvent[];
  referralCode: string | null;
  leaderboard: LeaderboardEntry[];
  loyaltyContent: LoyaltyContent;
}) {
  const level = getLevelInfo(lifetimePoints);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl font-bold">{loyaltyContent.name}</h1>

      <div className="bg-gradient-to-br from-mango-orange to-mango-deep text-white rounded-brand p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide opacity-80">Level</div>
            <div className="font-serif font-bold text-4xl">{level.level}</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold uppercase tracking-wide opacity-80">
              {loyaltyContent.currencyTitleCase}
            </div>
            <div className="font-serif font-bold text-3xl">{mangoCredits}</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="h-2.5 rounded-full bg-white/25 overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${level.progressPercent}%` }}
            />
          </div>
          <p className="text-xs mt-1.5 opacity-90">
            {level.pointsIntoLevel} / {level.pointsForNextLevel} points to Level {level.level + 1}
          </p>
        </div>
      </div>

      <CheckInCard checkedInToday={checkedInToday} currentStreak={currentStreak} loyalty={loyaltyContent} />

      <ReferralCard referralCode={referralCode} loyalty={loyaltyContent} />

      <LeaderboardCard entries={leaderboard} loyalty={loyaltyContent} />

      <div className="bg-surface border border-border-subtle rounded-brand p-6">
        <h2 className="font-serif font-bold text-lg mb-1">Redeem Credits</h2>
        <p className="text-sm text-ink-light mb-4">
          Trade {loyaltyContent.currencyPlural} for a discount code you can use at checkout.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {MANGO_REWARD_TIERS.map((tier) => (
            <RedeemTierButton key={tier.tier} tier={tier} mangoCredits={mangoCredits} loyalty={loyaltyContent} />
          ))}
        </div>
      </div>

      <div className="bg-surface border border-border-subtle rounded-brand p-6">
        <h2 className="font-serif font-bold text-lg mb-4">Recent Activity</h2>
        {events.length === 0 ? (
          <p className="text-sm text-ink-light">
            No activity yet — check in daily or leave a review to start earning.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {events.map((e) => (
              <li
                key={e.id}
                className="flex items-center justify-between text-sm py-2 border-b border-border-subtle last:border-b-0"
              >
                <span>{eventLabel(e)}</span>
                <span className={e.points >= 0 ? "text-orchard-green font-semibold" : "text-ink-light font-semibold"}>
                  {e.points >= 0 ? "+" : ""}
                  {e.points}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// mangoCredits comes straight from the server-rendered page prop, which
// Next.js automatically re-fetches after this form's Server Action
// resolves -- no local optimistic state needed, and none of the staleness
// risk that comes with it.
function RedeemTierButton({
  tier,
  mangoCredits,
  loyalty,
}: {
  tier: (typeof MANGO_REWARD_TIERS)[number];
  mangoCredits: number;
  loyalty: LoyaltyContent;
}) {
  const [state, formAction, pending] = useActionState(async () => redeem(tier.tier), undefined);
  const canAfford = mangoCredits >= tier.cost;

  return (
    <div className="border border-border-subtle rounded-2xl p-5 flex flex-col gap-3">
      <div>
        <div className="text-xs font-bold uppercase tracking-wide text-mango-orange">{tier.label}</div>
        <div className="font-serif font-bold text-2xl">{tier.discountPercent}% off</div>
        <div className="text-xs text-ink-light">{tier.cost} {loyalty.currencyPlural}</div>
      </div>
      <form action={formAction}>
        <button
          type="submit"
          disabled={pending || !canAfford}
          className="w-full bg-mango-orange/10 text-mango-orange text-sm font-semibold px-4 py-2 rounded-full transition-colors hover:bg-mango-orange hover:text-white disabled:opacity-40 disabled:hover:bg-mango-orange/10 disabled:hover:text-mango-orange"
        >
          {pending ? "Redeeming…" : canAfford ? "Redeem" : "Not enough credits"}
        </button>
      </form>
      {state && "error" in state && <p className="text-xs text-error">{state.error}</p>}
      {state && "success" in state && (
        <p className="text-xs text-orchard-green font-mono break-all">
          Code: {state.couponCode} — use at checkout
        </p>
      )}
    </div>
  );
}
