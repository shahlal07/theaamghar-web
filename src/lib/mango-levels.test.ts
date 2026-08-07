import { describe, expect, it } from "vitest";
import { getLevelInfo } from "./mango-levels";

describe("getLevelInfo", () => {
  it("starts everyone at level 1 with zero points", () => {
    expect(getLevelInfo(0)).toEqual({
      level: 1,
      pointsIntoLevel: 0,
      pointsForNextLevel: 100,
      progressPercent: 0,
    });
  });

  it("stays at level 1 until the level-2 threshold is reached", () => {
    expect(getLevelInfo(99).level).toBe(1);
    expect(getLevelInfo(100).level).toBe(2);
  });

  it("computes progress within the current level", () => {
    // Level 2 spans 100-250 (150-point span); 175 is 75 points in.
    const info = getLevelInfo(175);
    expect(info.level).toBe(2);
    expect(info.pointsIntoLevel).toBe(75);
    expect(info.pointsForNextLevel).toBe(150);
    expect(info.progressPercent).toBe(50);
  });

  it("never reports more than 100% progress", () => {
    const info = getLevelInfo(249);
    expect(info.progressPercent).toBeLessThanOrEqual(100);
  });

  it("extrapolates levels beyond the hardcoded threshold table at +1500/level", () => {
    // Table's last defined threshold (level 10) is 5000.
    const level10 = getLevelInfo(5000);
    expect(level10.level).toBe(10);

    const level11 = getLevelInfo(6500);
    expect(level11.level).toBe(11);
    expect(level11.pointsForNextLevel).toBe(1500);
  });

  it("never divides by zero or throws for very large point totals", () => {
    expect(() => getLevelInfo(1_000_000)).not.toThrow();
  });
});
