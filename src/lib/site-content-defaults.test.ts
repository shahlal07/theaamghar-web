import { describe, expect, it } from "vitest";
import { mergeSiteContent, DEFAULT_SITE_CONTENT } from "./site-content-defaults";

describe("mergeSiteContent", () => {
  it("returns the defaults untouched when there's no override", () => {
    expect(mergeSiteContent(DEFAULT_SITE_CONTENT, null)).toEqual(DEFAULT_SITE_CONTENT);
    expect(mergeSiteContent(DEFAULT_SITE_CONTENT, undefined)).toEqual(DEFAULT_SITE_CONTENT);
  });

  it("overrides only the fields present in a partial patch, keeping everything else from defaults", () => {
    const merged = mergeSiteContent(DEFAULT_SITE_CONTENT, {
      hero: { headlineLine1: "New Season." } as never,
    });
    expect(merged.hero.headlineLine1).toBe("New Season.");
    // Sibling fields in the same section survive the partial patch.
    expect(merged.hero.headlineLine2).toBe(DEFAULT_SITE_CONTENT.hero.headlineLine2);
    expect(merged.hero.ctaPrimaryText).toBe(DEFAULT_SITE_CONTENT.hero.ctaPrimaryText);
    // Untouched sections are completely unaffected.
    expect(merged.footer).toEqual(DEFAULT_SITE_CONTENT.footer);
  });

  it("replaces an array wholesale rather than merging by index", () => {
    const merged = mergeSiteContent(DEFAULT_SITE_CONTENT, {
      trustBar: { items: ["Only One Item Now"] },
    });
    expect(merged.trustBar.items).toEqual(["Only One Item Now"]);
  });

  it("never lets a rebrand blank out a section it didn't touch (the live-site-safety guarantee)", () => {
    const merged = mergeSiteContent(DEFAULT_SITE_CONTENT, {
      brand: { logoText: "StyleHub" } as never,
    });
    expect(merged.loyaltyProgram).toEqual(DEFAULT_SITE_CONTENT.loyaltyProgram);
    expect(merged.aiAssistant).toEqual(DEFAULT_SITE_CONTENT.aiAssistant);
    expect(merged.emailBrand).toEqual(DEFAULT_SITE_CONTENT.emailBrand);
  });
});
