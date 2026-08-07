import { describe, expect, it } from "vitest";
import { formatPKR } from "./format";

describe("formatPKR", () => {
  it("formats a whole number with thousands separators", () => {
    expect(formatPKR(1000)).toBe("Rs 1,000");
  });

  it("rounds fractional amounts", () => {
    expect(formatPKR(1499.6)).toBe("Rs 1,500");
    expect(formatPKR(1499.4)).toBe("Rs 1,499");
  });

  it("formats zero", () => {
    expect(formatPKR(0)).toBe("Rs 0");
  });

  it("formats large amounts", () => {
    expect(formatPKR(1234567)).toBe("Rs 1,234,567");
  });
});
