// Shared discount math for checkout -- was previously duplicated between
// the client-side total preview (checkout-form.tsx) and the server-side
// authoritative calculation (checkout/actions.ts), which is exactly the
// kind of money-adjacent logic that's easy to let drift out of sync
// silently. Pull any future discount type/rounding change through here so
// both sides can never disagree about what a given discount is worth.
export type DiscountType = "percent" | "fixed" | "free_shipping";

export function computeDiscount(
  discountType: DiscountType | string | null | undefined,
  discountValue: number | null | undefined,
  subtotal: number,
  shippingFee: number
): { discountAmount: number; shippingFee: number } {
  if (discountType === "percent") {
    return { discountAmount: Math.round((subtotal * (discountValue ?? 0)) / 100), shippingFee };
  }
  if (discountType === "fixed") {
    return { discountAmount: Math.min(discountValue ?? 0, subtotal), shippingFee };
  }
  if (discountType === "free_shipping") {
    // Deliberately does NOT zero shippingFee here. computeOrderTotal does
    // subtotal + shippingFee - discountAmount -- zeroing shippingFee while
    // ALSO subtracting it as a discount cancels it out twice, undercharging
    // the customer by a full shipping fee. Keeping shippingFee at its real
    // value (for accurate shipping_fee/profit records) and setting
    // discountAmount to match it is what makes total net out to exactly
    // subtotal, and what makes "Shipping: Rs X" / "Discount: -Rs X" read
    // correctly as fully offsetting on any order summary.
    return { discountAmount: shippingFee, shippingFee };
  }
  return { discountAmount: 0, shippingFee };
}

export function computeOrderTotal(subtotal: number, shippingFee: number, discountAmount: number): number {
  return Math.max(0, subtotal + shippingFee - discountAmount);
}
