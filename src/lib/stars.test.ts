import { describe, expect, it } from "vitest";
import { starsHTML } from "./stars";

describe("starsHTML", () => {
  it("renders 5 star spans regardless of rating", () => {
    expect((starsHTML(3).match(/<span/g) ?? []).length).toBe(5);
  });

  it("fully highlights a whole-number rating", () => {
    const html = starsHTML(4);
    expect((html.match(/opacity:0\.25/g) ?? []).length).toBe(1);
  });

  it("rounds a fractional rating before deciding which stars are filled", () => {
    // 3.6 rounds to 4 -- 4 filled stars, 1 dim.
    const html = starsHTML(3.6);
    expect((html.match(/opacity:0\.25/g) ?? []).length).toBe(1);
  });

  it("dims every star for a zero rating", () => {
    const html = starsHTML(0);
    expect((html.match(/opacity:0\.25/g) ?? []).length).toBe(5);
  });

  it("fills every star for a perfect rating", () => {
    const html = starsHTML(5);
    expect((html.match(/opacity:0\.25/g) ?? []).length).toBe(0);
  });
});
