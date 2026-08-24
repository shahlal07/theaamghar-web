"use client";

import { useEffect, useRef, useState, useActionState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useUser } from "@/lib/use-user";
import { resolveCartLines, type CartLine } from "@/lib/queries/cart";
import { getShippingRate, PAKISTAN_PROVINCES } from "@/lib/queries/shipping";
import { getAddressesForCurrentUserClient } from "@/lib/queries/addresses-client";
import { createClient as createBrowserSupabaseClient } from "@/lib/supabase/client";
import { placeOrder, checkCoupon, type PlaceOrderState, type OrderLineInput } from "@/app/checkout/actions";
import { productImageSrc } from "@/lib/product-image";
import { formatPKR } from "@/lib/format";
import { computeDiscount, computeOrderTotal } from "@/lib/discount";
import type { SiteContent } from "@/lib/queries/site-content";
import { PaymentMethodSelector, type PaymentMethodValue } from "@/components/payment-method-selector";
import type { Tables } from "@/lib/supabase/types";

const PENDING_CHECKOUT_KEY = "theaamghar_pending_checkout";

type PendingCheckout = { lines: OrderLineInput[]; form: Record<string, string> };

function fillFormField(form: HTMLFormElement, name: string, value: string) {
  const field = form.elements.namedItem(name);
  if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) field.value = value;
}

function addressLine1(address: Tables<"addresses">) {
  const row = address as Tables<"addresses"> & { address_line1?: string; address?: string };
  return row.address_line1 ?? row.address ?? "";
}

export function CheckoutForm({ emptyStates }: { emptyStates: SiteContent["emptyStates"] }) {
  const searchParams = useSearchParams();
  const buynowUnitId = searchParams.get("buynow");
  const buynowSource = (searchParams.get("buynowSource") as "box_size" | "variant" | null) ?? "box_size";
  const buynowQty = Number(searchParams.get("qty")) || 1;
  const { items: cartItems, clearCart } = useCart();
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const lines: OrderLineInput[] = buynowUnitId ? [{ unitId: buynowUnitId, source: buynowSource, qty: buynowQty }] : cartItems;
  const [resolvedLines, setResolvedLines] = useState<CartLine[] | null>(null);
  const [shippingInfo, setShippingInfo] = useState<{ province: string; city: string; rate: number } | null>(null);
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [savedAddresses, setSavedAddresses] = useState<Tables<"addresses">[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("new");
  const [couponInput, setCouponInput] = useState("");
  const [couponChecking, setCouponChecking] = useState(false);
  const [couponState, setCouponState] = useState<{ status: "idle" | "valid" | "invalid"; message?: string; discountType?: string; discountValue?: number }>({ status: "idle" });
  const [welcomeDiscountPercent, setWelcomeDiscountPercent] = useState<number | null>(null);
  const [useWelcomeDiscount, setUseWelcomeDiscount] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodValue>("cod");
  const [paymentAccountId, setPaymentAccountId] = useState<string | null>(null);
  const [isGift, setIsGift] = useState(false);

  const boundPlaceOrder = async (_prev: PlaceOrderState, formData: FormData) => placeOrder(lines, formData);
  const [state, formAction, pending] = useActionState<PlaceOrderState, FormData>(boundPlaceOrder, undefined);

  useEffect(() => {
    resolveCartLines(lines).then(setResolvedLines);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(lines)]);

  useEffect(() => {
    if (!province || !city) return;
    let cancelled = false;
    getShippingRate(province, city).then((rate) => {
      if (!cancelled) setShippingInfo({ province, city, rate });
    });
    return () => { cancelled = true; };
  }, [province, city]);

  const shippingFee = shippingInfo && shippingInfo.province === province && shippingInfo.city === city ? shippingInfo.rate : null;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (user || userLoading) return;
    e.preventDefault();
    const formValues = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    try { window.localStorage.setItem(PENDING_CHECKOUT_KEY, JSON.stringify({ lines, form: formValues } satisfies PendingCheckout)); } catch {}
    const returnTo = buynowUnitId ? `/checkout?buynow=${buynowUnitId}&buynowSource=${buynowSource}&qty=${buynowQty}` : "/checkout";
    router.push(`/signup?returnTo=${encodeURIComponent(returnTo)}`);
  }

  useEffect(() => {
    if (!user || !formRef.current) return;
    let pendingCheckout: PendingCheckout | null = null;
    try {
      const raw = window.localStorage.getItem(PENDING_CHECKOUT_KEY);
      pendingCheckout = raw ? JSON.parse(raw) : null;
    } catch {}
    if (!pendingCheckout) return;
    window.localStorage.removeItem(PENDING_CHECKOUT_KEY);
    const form = formRef.current;
    Object.entries(pendingCheckout.form).forEach(([name, value]) => fillFormField(form, name, value));
    setProvince(pendingCheckout.form.province ?? "");
    setCity(pendingCheckout.form.city ?? "");
    form.requestSubmit();
  }, [user]);

  useEffect(() => {
    if (!user) {
      Promise.resolve().then(() => setSavedAddresses([]));
      return;
    }
    let cancelled = false;
    async function load() {
      const supabase = createBrowserSupabaseClient();
      const [{ data: profile }, addresses] = await Promise.all([
        supabase.from("profiles").select("name, phone, welcome_discount_percent, welcome_discount_claimed_at").eq("id", user!.id).single(),
        getAddressesForCurrentUserClient(),
      ]);
      if (cancelled) return;
      setSavedAddresses(addresses);
      setWelcomeDiscountPercent(profile?.welcome_discount_percent && !profile.welcome_discount_claimed_at ? Number(profile.welcome_discount_percent) : null);
      const hasPending = (() => { try { return Boolean(window.localStorage.getItem(PENDING_CHECKOUT_KEY)); } catch { return false; } })();
      if (hasPending) return;
      const form = formRef.current;
      if (form && profile?.name) fillFormField(form, "fullName", profile.name);
      const defaultAddress = addresses.find((a) => a.is_default) ?? addresses[0];
      if (defaultAddress) applyAddressToForm(defaultAddress, profile?.phone ?? "");
      else if (form && profile?.phone) fillFormField(form, "phone", profile.phone);
    }
    load();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  function applyAddressToForm(address: Tables<"addresses">, fallbackPhone = "") {
    const form = formRef.current;
    if (!form) return;
    const line1 = addressLine1(address);
    fillFormField(form, "phone", address.phone ?? fallbackPhone);
    fillFormField(form, "address", line1);
    fillFormField(form, "city", address.city);
    fillFormField(form, "postalCode", address.postal_code ?? "");
    setCity(address.city);
    setProvince(address.province ?? "");
    setSelectedAddressId(address.id);
  }

  function handleAddressSelect(value: string) {
    setSelectedAddressId(value);
    if (value === "new") {
      const form = formRef.current;
      if (form) ["phone", "address", "city", "postalCode"].forEach((name) => fillFormField(form, name, ""));
      setCity(""); setProvince(""); return;
    }
    const address = savedAddresses.find((a) => a.id === value);
    if (address) applyAddressToForm(address);
  }

  async function handleApplyCoupon() {
    const code = couponInput.trim();
    if (!code) return;
    setCouponChecking(true);
    const result = await checkCoupon(code, subtotal);
    setCouponChecking(false);
    if (result?.valid) setCouponState({ status: "valid", message: result.message, discountType: result.discountType || undefined, discountValue: result.discountValue || undefined });
    else setCouponState({ status: "invalid", message: result?.message ?? "Invalid coupon code." });
  }

  useEffect(() => {
    if (state && "success" in state && state.success) {
      if (!buynowUnitId) clearCart();
      window.location.href = `/track?order=${state.orderNumber}`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const subtotal = resolvedLines?.reduce((sum, l) => sum + l.lineTotal, 0) ?? 0;
  const discountAmount = useWelcomeDiscount && welcomeDiscountPercent
    ? computeDiscount("percent", welcomeDiscountPercent, subtotal, shippingFee ?? 0).discountAmount
    : couponState.status === "valid"
      ? computeDiscount(couponState.discountType, couponState.discountValue, subtotal, shippingFee ?? 0).discountAmount
      : 0;
  const total = computeOrderTotal(subtotal, shippingFee ?? 0, discountAmount);

  if (resolvedLines !== null && resolvedLines.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-4" aria-hidden="true">🛒</div>
        <h2 className="font-serif text-2xl font-bold mb-2">{emptyStates.cartTitle}</h2>
        <p className="text-ink-light mb-6">{emptyStates.cartSubtitle}</p>
        <Link href="/#shop" className="bg-mango-orange text-white font-semibold px-8 py-3 rounded-full">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-[1.2fr_1fr] gap-10">
      <form ref={formRef} action={formAction} onSubmit={handleSubmit} noValidate>
        <div className="bg-surface border border-border-subtle rounded-2xl shadow-brand-sm p-6 mb-5">
          <h2 className="font-serif text-xl font-bold mb-4">📍 Delivery Details</h2>
          {savedAddresses.length > 0 && (
            <div className="mb-4">
              <label htmlFor="savedAddress" className="text-sm font-medium block mb-1">Deliver to</label>
              <select id="savedAddress" value={selectedAddressId} onChange={(e) => handleAddressSelect(e.target.value)} className="w-full border-[1.5px] border-border-subtle rounded-xl px-4 py-3 text-sm bg-surface focus-visible:outline-none focus-visible:border-mango-orange transition-colors">
                {savedAddresses.map((a) => { const label = addressLine1(a); return <option key={a.id} value={a.id}>{a.label ?? a.city} — {label.slice(0, 40)}{label.length > 40 ? "…" : ""}</option>; })}
                <option value="new">+ Enter a new address</option>
              </select>
            </div>
          )}
          <div className="flex flex-col gap-4">
            <Field id="fullName" name="fullName" label={isGift ? "Recipient's Name" : "Full Name"} required maxLength={80} />
            <Field id="phone" name="phone" label="Phone Number" type="tel" required placeholder="03XX-XXXXXXX" maxLength={20} />
            <div>
              <label htmlFor="address" className="text-sm font-medium block mb-1">Street Address</label>
              <textarea id="address" name="address" required maxLength={200} rows={3} className="w-full border-[1.5px] border-border-subtle rounded-xl px-4 py-3 text-sm bg-surface focus-visible:outline-none focus-visible:border-mango-orange transition-colors" />
            </div>
            {/* min-w-0 on both grid items: a <select>'s intrinsic min-content
                width can be as wide as its longest <option> ("Islamabad
                Capital Territory") regardless of w-full, and CSS Grid's
                default min-width:auto lets that blow the item (and the
                whole form, and the whole page) past the viewport on mobile
                -- this was the real cause of the checkout page rendering
                off-center/horizontally scrollable on phones. */}
            <div className="grid grid-cols-2 gap-3">
              <div className="min-w-0">
                <label htmlFor="province" className="text-sm font-medium block mb-1">Province</label>
                <select id="province" name="province" required value={province} onChange={(e) => setProvince(e.target.value)} className="w-full border-[1.5px] border-border-subtle rounded-xl px-4 py-3 text-sm bg-surface focus-visible:outline-none focus-visible:border-mango-orange transition-colors">
                  <option value="">Select…</option>
                  {PAKISTAN_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="min-w-0">
                <label htmlFor="city" className="text-sm font-medium block mb-1">City</label>
                <input id="city" name="city" type="text" required maxLength={60} value={city} onChange={(e) => setCity(e.target.value)} className="w-full border-[1.5px] border-border-subtle rounded-xl px-4 py-3 text-sm bg-surface focus-visible:outline-none focus-visible:border-mango-orange transition-colors" />
              </div>
            </div>
            <Field id="postalCode" name="postalCode" label="Postal Code (optional)" maxLength={10} />
            <div>
              <label htmlFor="notes" className="text-sm font-medium block mb-1">Delivery Notes (optional)</label>
              <textarea id="notes" name="notes" maxLength={500} rows={2} placeholder="Gate code, landmark, preferred delivery time…" className="w-full border-[1.5px] border-border-subtle rounded-xl px-4 py-3 text-sm bg-surface focus-visible:outline-none focus-visible:border-mango-orange transition-colors" />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="isGift" value="true" checked={isGift} onChange={(e) => setIsGift(e.target.checked)} className="w-5 h-5 accent-mango-orange" />
              <span className="text-sm font-medium">🎁 This is a gift</span>
            </label>
            {isGift && (
              <div className="pl-2 border-l-2 border-mango-orange/30">
                <label htmlFor="giftMessage" className="text-sm font-medium block mb-1">Gift Message (optional)</label>
                <textarea id="giftMessage" name="giftMessage" maxLength={300} rows={2} placeholder="Happy birthday! Hope you enjoy this 🎁" className="w-full border-[1.5px] border-border-subtle rounded-xl px-4 py-3 text-sm bg-surface focus-visible:outline-none focus-visible:border-mango-orange transition-colors" />
                <p className="text-xs text-ink-light mt-1.5">We&apos;ll ship straight to the recipient — use their name and address above.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-surface border border-border-subtle rounded-2xl shadow-brand-sm p-6 mb-5">
          <h2 className="font-serif text-xl font-bold mb-4">💰 Payment Method</h2>
          <input type="hidden" name="paymentMethod" value={paymentMethod} />
          <input type="hidden" name="paymentAccountId" value={paymentAccountId ?? ""} />
          <PaymentMethodSelector value={paymentMethod} onChange={(method, accountId) => { setPaymentMethod(method); setPaymentAccountId(accountId); }} total={total} />
        </div>

        <div className="bg-surface border border-border-subtle rounded-2xl shadow-brand-sm p-6 mb-5">
          <h2 className="font-serif text-xl font-bold mb-4">🏷️ Discount</h2>
          <input type="hidden" name="useWelcomeDiscount" value={useWelcomeDiscount && welcomeDiscountPercent ? "true" : ""} />
          <input type="hidden" name="couponCode" value={!useWelcomeDiscount && couponState.status === "valid" ? couponInput.trim() : ""} />
          {welcomeDiscountPercent && (
            <label className="flex items-start gap-3 mb-4 p-3.5 bg-cream-warm rounded-xl cursor-pointer">
              <input type="checkbox" checked={useWelcomeDiscount} onChange={(e) => { setUseWelcomeDiscount(e.target.checked); if (e.target.checked) { setCouponInput(""); setCouponState({ status: "idle" }); } }} className="mt-0.5" />
              <span className="text-sm"><span className="font-semibold">Use my {welcomeDiscountPercent}% welcome discount</span><span className="block text-xs text-ink-light">One-time customer welcome discount.</span></span>
            </label>
          )}
          <div className="flex gap-2">
            <input type="text" value={couponInput} disabled={useWelcomeDiscount} onChange={(e) => { setCouponInput(e.target.value); if (couponState.status !== "idle") setCouponState({ status: "idle" }); }} placeholder="Enter coupon code" maxLength={40} className="flex-1 border-[1.5px] border-border-subtle rounded-full px-4 py-2.5 text-sm uppercase bg-surface focus-visible:outline-none focus-visible:border-mango-orange transition-colors disabled:opacity-50" />
            <button type="button" onClick={handleApplyCoupon} disabled={useWelcomeDiscount || couponChecking || !couponInput.trim()} className="bg-orchard-green text-white text-sm font-semibold px-5 py-2.5 rounded-full disabled:opacity-60">{couponChecking ? "Checking…" : "Apply"}</button>
          </div>
          {couponState.message && !useWelcomeDiscount && <p className={`text-xs mt-2 ${couponState.status === "valid" ? "text-orchard-green" : "text-error"}`}>{couponState.status === "valid" ? "✓ " : ""}{couponState.message}</p>}
        </div>

        {state && "error" in state && <p className="text-sm text-error mb-4">{state.error}</p>}
        <button type="submit" disabled={pending || resolvedLines === null} className="w-full bg-mango-orange text-white font-semibold py-4 rounded-full transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0">
          {pending ? "Placing Order…" : `${buynowUnitId ? "Buy Now" : "Place Order"} — ${formatPKR(total)}`}
        </button>
        {!user && !userLoading && <p className="text-xs text-ink-light text-center mt-3">🔒 You&apos;ll be asked to sign in or create a free account to complete your order — we&apos;ll bring you right back here.</p>}
      </form>

      <div>
        <div className="bg-cream-warm border border-border-subtle rounded-2xl shadow-brand-sm p-6 md:sticky md:top-24">
          <h2 className="font-serif text-xl font-bold mb-4">Order Summary</h2>
          {resolvedLines === null ? <p className="text-sm text-ink-light">Loading…</p> : <div className="flex flex-col gap-3 mb-4">
            {resolvedLines.map((line) => (
              <div key={line.unitId} className="flex gap-3 items-center pb-3 border-b border-border-subtle">
                {line.image && <Image src={productImageSrc(line.image, 400)} alt="" width={56} height={56} className="rounded-xl object-cover w-14 h-14 shrink-0" />}
                <div className="flex-1 text-sm"><div className="font-semibold">{line.name}</div><div className="text-ink-light text-xs">{line.source === "box_size" ? `${line.label} box` : line.label} × {line.qty}</div></div>
                <div className="font-bold text-mango-orange text-sm tabular-nums">{formatPKR(line.lineTotal)}</div>
              </div>
            ))}
          </div>}
          <div className="flex justify-between text-sm py-1 tabular-nums"><span className="text-ink-light">Subtotal</span><span>{formatPKR(subtotal)}</span></div>
          <div className="flex justify-between text-sm py-1 tabular-nums"><span className="text-ink-light">Shipping</span><span>{shippingFee === null ? "—" : formatPKR(shippingFee)}</span></div>
          {discountAmount > 0 && <div className="flex justify-between text-sm py-1 text-orchard-green tabular-nums"><span>Discount</span><span>−{formatPKR(discountAmount)}</span></div>}
          <div className="flex justify-between font-bold text-lg pt-3 mt-2 border-t-[1.5px] border-border-subtle tabular-nums"><span>Total</span><span className="text-mango-orange">{formatPKR(total)}</span></div>
          <p className="text-xs text-ink-light mt-4 pt-4 border-t border-border-subtle">🚚 Usually delivered next-day, or same-day if you order before 3pm.</p>
        </div>
      </div>
    </div>
  );
}

function Field({ id, name, label, type = "text", required, maxLength, placeholder }: { id: string; name: string; label: string; type?: string; required?: boolean; maxLength?: number; placeholder?: string }) {
  return <div><label htmlFor={id} className="text-sm font-medium block mb-1">{label}</label><input id={id} name={name} type={type} required={required} maxLength={maxLength} placeholder={placeholder} className="w-full border-[1.5px] border-border-subtle rounded-xl px-4 py-3 text-sm bg-surface focus-visible:outline-none focus-visible:border-mango-orange transition-colors" /></div>;
}
