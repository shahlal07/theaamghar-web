import { describe, expect, it } from "vitest";
import { computeDiscount, computeOrderTotal } from "./discount";

describe("computeDiscount", () => {
  it("computes a percent discount, rounded", () => {
    expect(computeDiscount("percent", 10, 1999, 250)).toEqual({
      discountAmount: 200, // 10% of 1999 = 199.9, rounds to 200
      shippingFee: 250,
    });
  });

  it("computes a fixed discount", () => {
    expect(computeDiscount("fixed", 300, 2000, 250)).toEqual({
      discountAmount: 300,
      shippingFee: 250,
    });
  });

  it("caps a fixed discount at the subtotal so it can never exceed it", () => {
    expect(computeDiscount("fixed", 5000, 2000, 250)).toEqual({
      discountAmount: 2000,
      shippingFee: 250,
    });
  });

  it("keeps the real shipping fee (for accurate records) and discounts it by the same amount, netting to zero extra charge", () => {
    // Regression test: an earlier version of this logic zeroed shippingFee
    // AND subtracted it as a discount, which double-counted the waiver and
    // undercharged the customer by a full shipping fee (subtotal - fee
    // instead of subtotal). shippingFee must stay at its real value here.
    expect(computeDiscount("free_shipping", 0, 2000, 250)).toEqual({
      discountAmount: 250,
      shippingFee: 250,
    });
  });

  it("applies no discount for an unknown/missing discount type", () => {
    expect(computeDiscount(null, null, 2000, 250)).toEqual({
      discountAmount: 0,
      shippingFee: 250,
    });
    expect(computeDiscount("something_else", 10, 2000, 250)).toEqual({
      discountAmount: 0,
      shippingFee: 250,
    });
  });

  it("treats a missing discount_value as zero rather than throwing", () => {
    expect(computeDiscount("percent", null, 2000, 250)).toEqual({
      discountAmount: 0,
      shippingFee: 250,
    });
  });
});

describe("computeOrderTotal", () => {
  it("adds shipping and subtracts the discount", () => {
    expect(computeOrderTotal(2000, 250, 200)).toBe(2050);
  });

  it("never goes negative even if the discount exceeds subtotal + shipping", () => {
    expect(computeOrderTotal(100, 0, 5000)).toBe(0);
  });

  it("returns exactly the subtotal when a free_shipping discount cancels the fee", () => {
    const { discountAmount, shippingFee } = computeDiscount("free_shipping", 0, 2000, 250);
    expect(computeOrderTotal(2000, shippingFee, discountAmount)).toBe(2000);
  });
});
