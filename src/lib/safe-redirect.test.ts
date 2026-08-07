import { describe, expect, it } from "vitest";
import { safeRedirectPath } from "./safe-redirect";

describe("safeRedirectPath", () => {
  it("allows a normal relative path", () => {
    expect(safeRedirectPath("/account/orders")).toBe("/account/orders");
  });

  it("falls back for a missing value", () => {
    expect(safeRedirectPath(null)).toBe("/account");
    expect(safeRedirectPath(undefined)).toBe("/account");
    expect(safeRedirectPath("")).toBe("/account");
  });

  it("falls back for an absolute URL to another origin", () => {
    expect(safeRedirectPath("https://evil.example/phish")).toBe("/account");
    expect(safeRedirectPath("http://evil.example")).toBe("/account");
  });

  it("falls back for a protocol-relative URL", () => {
    expect(safeRedirectPath("//evil.example")).toBe("/account");
  });

  it("falls back for a path missing the leading slash", () => {
    expect(safeRedirectPath("account/orders")).toBe("/account");
  });

  it("respects a custom fallback", () => {
    expect(safeRedirectPath(null, "/checkout")).toBe("/checkout");
  });
});
