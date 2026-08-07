// Mirrors the reward tiers hardcoded server-side in redeem_mango_credits() --
// keep these two in sync if the tiers ever change (cost/value are enforced
// server-side regardless, this is display-only).
export const MANGO_REWARD_TIERS = [
  { tier: "bronze", cost: 300, discountPercent: 10, label: "Bronze" },
  { tier: "silver", cost: 700, discountPercent: 15, label: "Silver" },
  { tier: "gold", cost: 1500, discountPercent: 20, label: "Gold" },
] as const;

// Level N requires this many cumulative lifetime points. Beyond level 10,
// each level costs 1500 more than the last.
const LEVEL_THRESHOLDS = [0, 100, 250, 500, 900, 1400, 2000, 2800, 3800, 5000];

function thresholdForLevel(level: number): number {
  if (level <= LEVEL_THRESHOLDS.length) return LEVEL_THRESHOLDS[level - 1];
  return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + (level - LEVEL_THRESHOLDS.length) * 1500;
}

export type LevelInfo = {
  level: number;
  pointsIntoLevel: number;
  pointsForNextLevel: number;
  progressPercent: number;
};

export function getLevelInfo(lifetimePoints: number): LevelInfo {
  let level = 1;
  while (thresholdForLevel(level + 1) <= lifetimePoints) level++;

  const currentThreshold = thresholdForLevel(level);
  const nextThreshold = thresholdForLevel(level + 1);
  const pointsIntoLevel = lifetimePoints - currentThreshold;
  const pointsForNextLevel = nextThreshold - currentThreshold;

  return {
    level,
    pointsIntoLevel,
    pointsForNextLevel,
    progressPercent: Math.min(100, Math.round((pointsIntoLevel / pointsForNextLevel) * 100)),
  };
}
