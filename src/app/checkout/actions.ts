"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getShippingRateServer } from "@/lib/queries/shipping-server";
import { sendOrderConfirmationEmail, sendAdminNewOrderAlert, ADMIN_ALERT_EMAIL } from "@/lib/email";
import { computeDiscount, computeOrderTotal } from "@/lib/discount";
import { variantLabel } from "@/lib/variant-label";
import { getOrderItemVariantLabel, type OrderItem } from "@/lib/order-item";

export type OrderLineInput = { unitId: string; source?: "box_size" | "variant"; qty: number };

export type PlaceOrderState =
  | { error: string }
  | { success: true; orderNumber: string }
  | undefined;

const PK_PHONE_PATTERN = /^(?:\+92|0092|0)?3\d{2}[-\s]?\d{7}$/;

export type CheckCouponState =
  | { valid: false; message: string }
  | { valid: true; discountType: string; discountValue: number; message: string }
  | undefined;

// Routes coupon checks through our own server (instead of the client calling
// supabase.rpc("validate_coupon") directly with the anon key) so we can rate
// limit by the real request IP -- validate_coupon is deliberately callable
// anonymously (guests can preview a discount before signing up), which
// otherwise made it scriptable to brute-force/enumerate live codes at
// unlimited volume with only a valid/invalid signal per guess.
export async function checkCoupon(code: string, subtotal: number): Promise<CheckCouponState> {
  const supabase = await createClient();
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "unknown";

  const { data: rateLimit } = await supabase
    .rpc("check_and_record_coupon_attempt", { p_identifier: ip })
    .single();
  if (!rateLimit?.allowed) {
    return { valid: false, message: "Too many attempts. Please try again in a few minutes." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .rpc("validate_coupon", { p_code: code, p_order_amount: subtotal, p_customer_id: user?.id })
    .single();

  if (!data?.valid) return { valid: false, message: data?.message ?? "Invalid coupon code." };
  return {
    valid: true,
    discountType: data.discount_type ?? "",
    discountValue: Number(data.discount_value ?? 0),
    message: data.message,
  };
}

export async function placeOrder(
  lines: OrderLineInput[],
  formData: FormData
): Promise<PlaceOrderState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Please sign in to place your order." };
  }

  if (lines.length === 0) {
    return { error: "Your cart is empty." };
  }

  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const province = String(formData.get("province") ?? "").trim();
  const postalCode = String(formData.get("postalCode") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim().slice(0, 500);
  const isGift = formData.get("isGift") === "true";
  const giftMessage = isGift ? String(formData.get("giftMessage") ?? "").trim().slice(0, 300) : "";

  if (!fullName || !phone || !address || !city || !province) {
    return { error: "Please fill in all required delivery details." };
  }
  if (!PK_PHONE_PATTERN.test(phone)) {
    return { error: "Enter a valid Pakistani mobile number, e.g. 0300-1234567." };
  }

  // Re-resolve units server-side -- never trust price/stock/name the client
  // sent, even though the UI already prevents selecting an out-of-stock
  // unit. This is the actual enforcement point.
  const boxSizeLines = lines.filter((l) => (l.source ?? "box_size") === "box_size");
  const variantLines = lines.filter((l) => l.source === "variant");

  const [{ data: boxSizes, error: boxSizesError }, { data: variants, error: variantsError }] =
    await Promise.all([
      boxSizeLines.length > 0
        ? supabase
            .from("product_box_sizes")
            .select(
              "id, box_size_kg, selling_price, stock_qty, active, product:products(id, name, vendor_id, status, product_type)"
            )
            .in(
              "id",
              boxSizeLines.map((l) => l.unitId)
            )
        : Promise.resolve({ data: [], error: null }),
      variantLines.length > 0
        ? supabase
            .from("product_variants")
            .select(
              "id, attributes, label, selling_price, stock_qty, active, product:products(id, name, vendor_id, status, product_type)"
            )
            .in(
              "id",
              variantLines.map((l) => l.unitId)
            )
        : Promise.resolve({ data: [], error: null }),
    ]);

  if (boxSizesError || variantsError) {
    return { error: "Something went wrong reading your cart. Please try again." };
  }

  const qtyByUnit = new Map(lines.map((l) => [l.unitId, l.qty]));
  const orderItems: OrderItem[] = [];
  let subtotal = 0;
  let vendorId: string | null = null;

  for (const box of boxSizes ?? []) {
    const qty = qtyByUnit.get(box.id) ?? 0;
    if (qty <= 0 || !box.active || !box.product || box.product.status !== "published") {
      return { error: "One of the items in your cart is no longer available." };
    }
    if (box.stock_qty < qty) {
      return { error: `Only ${box.stock_qty} left of ${box.product.name} (${box.box_size_kg}kg) -- please adjust the quantity.` };
    }
    const unitPrice = Number(box.selling_price);
    orderItems.push({
      product_id: box.product.id,
      name: box.product.name,
      // No separate "variety" concept in this catalog yet -- the product
      // name itself is the variety (e.g. "Sindhri Mango"), matching what
      // theaamghar-admin's order UI expects a non-empty string for.
      variety: box.product.name,
      qty,
      unit_price: unitPrice,
      box_size_kg: Number(box.box_size_kg),
      product_type: box.product.product_type,
      variant_id: box.id,
      variant_source: "box_size",
      variant_label: variantLabel({ kind: "box_size", box_size_kg: Number(box.box_size_kg) }),
      variant_attributes: { box_size_kg: Number(box.box_size_kg) },
    });
    subtotal += unitPrice * qty;
    vendorId = box.product.vendor_id;
  }

  for (const variant of variants ?? []) {
    const qty = qtyByUnit.get(variant.id) ?? 0;
    if (qty <= 0 || !variant.active || !variant.product || variant.product.status !== "published") {
      return { error: "One of the items in your cart is no longer available." };
    }
    const label = variantLabel({
      kind: "variant",
      attributes: (variant.attributes ?? {}) as Record<string, string>,
      label: variant.label,
    });
    if (variant.stock_qty < qty) {
      return { error: `Only ${variant.stock_qty} left of ${variant.product.name} (${label}) -- please adjust the quantity.` };
    }
    const unitPrice = Number(variant.selling_price);
    orderItems.push({
      product_id: variant.product.id,
      name: variant.product.name,
      variety: variant.product.name,
      qty,
      unit_price: unitPrice,
      product_type: variant.product.product_type,
      variant_id: variant.id,
      variant_source: "variant",
      variant_label: label,
      variant_attributes: (variant.attributes ?? {}) as Record<string, string>,
    });
    subtotal += unitPrice * qty;
    vendorId = variant.product.vendor_id;
  }

  if (!vendorId) {
    return { error: "Something went wrong. Please try again." };
  }

  let shippingFee = await getShippingRateServer(supabase, province, city);

  // Re-validate the coupon server-side -- never trust a discount amount the
  // client computed. A blank/invalid code just means no discount, not an
  // error (the client already told the customer why, if it was invalid).
  const couponCode = String(formData.get("couponCode") ?? "").trim();
  const useWelcomeDiscount = String(formData.get("useWelcomeDiscount") ?? "") === "true";
  let discountAmount = 0;
  let appliedCouponCode: string | null = null;
  let welcomeDiscountGranted = false;

  if (useWelcomeDiscount) {
    // Atomic claim (UPDATE...WHERE claimed_at IS NULL...RETURNING inside the
    // RPC) -- a plain read-then-write-later here was a real race: two
    // concurrent checkouts (double-submit, two tabs) could both read
    // "unclaimed" before either write landed, applying the one-time welcome
    // discount to multiple orders.
    const { data: claimResult } = await supabase.rpc("claim_welcome_discount").single();
    if (claimResult?.discount_percent) {
      discountAmount = Math.round((subtotal * Number(claimResult.discount_percent)) / 100);
      welcomeDiscountGranted = true;
      appliedCouponCode = "WELCOME";
    }
  } else if (couponCode) {
    const { data: couponResult } = await supabase
      .rpc("validate_coupon", { p_code: couponCode, p_order_amount: subtotal, p_customer_id: user.id })
      .single();

    if (couponResult?.valid) {
      appliedCouponCode = couponCode.toUpperCase();
      const result = computeDiscount(
        couponResult.discount_type,
        Number(couponResult.discount_value),
        subtotal,
        shippingFee
      );
      discountAmount = result.discountAmount;
      shippingFee = result.shippingFee;
    }
  }

  const total = computeOrderTotal(subtotal, shippingFee, discountAmount);

  // Re-resolve the payment method server-side. A manual method is only
  // honoured if that payment account actually exists and is active -- so a
  // tampered form can't attach an order to a deactivated (or fabricated)
  // account, and anything unrecognised falls back to COD rather than
  // leaving the order in a payment state nobody can act on.
  const requestedMethod = String(formData.get("paymentMethod") ?? "cod");
  const requestedAccountId = String(formData.get("paymentAccountId") ?? "").trim();
  let paymentMethod = "cod";
  let paymentAccountId: string | null = null;

  if (["bank", "easypaisa", "jazzcash"].includes(requestedMethod) && requestedAccountId) {
    const { data: account } = await supabase
      .from("payment_accounts")
      .select("id, method")
      .eq("id", requestedAccountId)
      .eq("active", true)
      .maybeSingle();

    if (account && account.method === requestedMethod) {
      paymentMethod = requestedMethod;
      paymentAccountId = account.id;
    }
  }

  const { data: order, error: insertError } = await supabase
    .from("orders")
    .insert({
      customer_id: user.id,
      vendor_id: vendorId,
      items: orderItems,
      delivery: { full_name: fullName, phone, address, city, postal_code: postalCode || null, notes: notes || null, province },
      subtotal,
      shipping_fee: shippingFee,
      discount_code: appliedCouponCode,
      discount_amount: discountAmount,
      total,
      payment_method: paymentMethod,
      payment_account_id: paymentAccountId,
      is_gift: isGift,
      gift_recipient_name: isGift ? fullName : null,
      gift_message: giftMessage || null,
    })
    .select("order_number")
    .single();

  if (appliedCouponCode && !welcomeDiscountGranted && !insertError) {
    // coupons has no customer SELECT/UPDATE policy by design (codes
    // shouldn't be enumerable) -- incrementing usage goes through this
    // SECURITY DEFINER RPC instead of a direct table write. Best-effort:
    // a failure here shouldn't fail an order that already succeeded.
    await supabase.rpc("increment_coupon_usage", { p_code: appliedCouponCode });
  }

  if (insertError || !order) {
    return { error: "Something went wrong placing your order. Please try again." };
  }

  // Save this address to the account for next time -- skip if an
  // identical one is already saved so repeat orders don't pile up
  // duplicates. Best-effort: a failure here shouldn't fail the order that
  // already succeeded.
  const { data: existingAddress } = await supabase
    .from("addresses")
    .select("id")
    .eq("profile_id", user.id)
    .eq("address", address)
    .eq("city", city)
    .maybeSingle();

  if (!existingAddress) {
    await supabase.from("addresses").insert({
      profile_id: user.id,
      label: "Delivery Address",
      address,
      city,
      province,
      postal_code: postalCode || null,
      phone,
    });
  }

  // Best-effort, fire-and-forget-ish (awaited so the try/catch inside each
  // sender can log, but never allowed to fail an order that already
  // succeeded). user.email is null for phone-only accounts -- skip the
  // customer email in that case rather than erroring.
  if (user.email) {
    await sendOrderConfirmationEmail({
      to: user.email,
      orderNumber: order.order_number,
      items: orderItems,
      subtotal,
      shippingFee,
      discountAmount,
      total,
      fullName,
      address,
      city,
      paymentMethod,
    });
  }
  if (ADMIN_ALERT_EMAIL) {
    await sendAdminNewOrderAlert({
      to: ADMIN_ALERT_EMAIL,
      orderNumber: order.order_number,
      total,
      customerName: fullName,
      itemsSummary: orderItems.map((i) => `${i.qty}x ${i.name} (${getOrderItemVariantLabel(i)})`).join(", "),
    });
  }

  return { success: true, orderNumber: order.order_number };
}
