"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/lib/use-user";
import { getOrderByNumberClient } from "@/lib/queries/orders-client";
import { formatPKR } from "@/lib/format";
import { PaymentProofPanel } from "@/components/payment-proof-panel";
import { getOrderItemVariantLabel } from "@/lib/order-item";
import { googleMapsUrl } from "@/lib/maps";
import type { Tables } from "@/lib/supabase/types";

const MANUAL_PAYMENT_METHODS = ["bank", "easypaisa", "jazzcash"];

type Order = Tables<"orders">;

const STATUS_STEPS = ["pending", "confirmed", "packed", "shipped", "delivered"] as const;
const STATUS_LABELS: Record<string, string> = {
  pending: "Order Placed",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export function TrackForm({ whatsappNumber }: { whatsappNumber: string | null }) {
  const searchParams = useSearchParams();
  const { user, loading: userLoading } = useUser();
  const [query, setQuery] = useState(searchParams.get("order") ?? "");
  // undefined = no search performed yet; null = searched, not found; an
  // Order = found. Deriving "searched" from this instead of a separate
  // boolean avoids a synchronous setState at the top of search() that
  // would otherwise run inside the auto-search effect below.
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const searched = order !== undefined;
  // Guards against React StrictMode's dev-only double-invoke (or rapid
  // re-searches) resolving out of order -- only the most recently *started*
  // request is allowed to commit its result, so a slower earlier request
  // can never clobber a newer one that already resolved.
  const latestRequestId = useRef(0);

  async function search(orderNumber: string) {
    if (!orderNumber.trim()) return;
    const requestId = ++latestRequestId.current;
    const result = await getOrderByNumberClient(orderNumber.trim().toUpperCase());
    if (requestId === latestRequestId.current) setOrder(result);
  }

  useEffect(() => {
    const initial = searchParams.get("order");
    // search()'s setOrder call happens after an await, not synchronously
    // in this effect body -- the lint rule's static analysis can't trace
    // through the async boundary and flags the call site anyway.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (initial && user) search(initial);
  }, [user, searchParams]);

  if (userLoading) return null;

  if (!user) {
    return (
      <div className="border-[1.5px] border-border-subtle rounded-2xl p-8 text-center">
        <p className="text-ink-light mb-4">Sign in to track your order.</p>
        <Link
          href={`/login?returnTo=${encodeURIComponent(
            `/track${query ? `?order=${query}` : ""}`
          )}`}
          className="bg-mango-orange text-white font-semibold px-6 py-3 rounded-full transition-transform hover:-translate-y-0.5 inline-block"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          search(query);
        }}
        className="flex gap-3 mb-8"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. TAG-100001"
          className="flex-1 border-[1.5px] border-border-subtle rounded-full px-5 py-3 text-sm bg-surface focus-visible:outline-none focus-visible:border-mango-orange transition-colors"
        />
        <button
          type="submit"
          className="bg-mango-orange text-white font-semibold px-6 py-3 rounded-full transition-transform hover:-translate-y-0.5"
        >
          Track
        </button>
      </form>

      {searched && order === null && (
        <p className="text-center text-ink-light py-10">
          No order found with that number on your account.
        </p>
      )}

      {order && <OrderDetail order={order} whatsappNumber={whatsappNumber} />}
    </div>
  );
}

function OrderDetail({
  order,
  whatsappNumber,
}: {
  order: Order;
  whatsappNumber: string | null;
}) {
  const items =
    (order.items as { name: string; box_size_kg?: number; variant_label?: string; qty: number; unit_price: number }[]) ??
    [];
  const delivery = order.delivery as {
    full_name: string;
    phone: string;
    address: string;
    city: string;
    province?: string;
  };
  const isTerminal = order.status === "cancelled" || order.status === "refunded";
  const currentStepIndex = STATUS_STEPS.indexOf(order.status as (typeof STATUS_STEPS)[number]);

  return (
    <div className="border border-border-subtle rounded-2xl p-6 shadow-brand-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xs text-ink-light">Order</div>
          <div className="font-bold text-lg tabular-nums">{order.order_number}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-ink-light">Placed</div>
          <div className="text-sm font-medium">
            {new Date(order.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
      </div>

      {isTerminal ? (
        <div className="bg-error/10 text-error font-semibold rounded-xl p-4 mb-6 text-center">
          {STATUS_LABELS[order.status]}
        </div>
      ) : (
        <div className="flex items-center justify-between mb-8">
          {STATUS_STEPS.map((step, i) => (
            <div key={step} className="flex-1 flex flex-col items-center relative">
              {i > 0 && (
                <div
                  className={`absolute top-3 right-1/2 w-full h-0.5 transition-colors ${
                    i <= currentStepIndex ? "bg-mango-orange" : "bg-border-subtle"
                  }`}
                />
              )}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-colors ${
                  i <= currentStepIndex
                    ? "bg-mango-orange text-white shadow-[0_0_0_4px_rgba(255,107,0,0.15)]"
                    : "bg-border-subtle text-ink-light"
                }`}
              >
                {i <= currentStepIndex ? "✓" : i + 1}
              </div>
              <div className={`text-xs text-center mt-2 ${i === currentStepIndex ? "text-ink font-semibold" : "text-ink-light"}`}>
                {STATUS_LABELS[step]}
              </div>
            </div>
          ))}
        </div>
      )}

      {MANUAL_PAYMENT_METHODS.includes(order.payment_method ?? "") && (
        <PaymentProofPanel
          orderNumber={order.order_number}
          paymentMethod={order.payment_method!}
          paymentStatus={order.payment_status}
          paymentAccountId={order.payment_account_id}
          rejectionReason={order.payment_rejection_reason}
          total={Number(order.total)}
          whatsappNumber={whatsappNumber}
          vendorId={order.vendor_id}
        />
      )}

      {order.tracking_number && (
        <div className="text-sm mb-4 bg-cream-warm rounded-xl p-3.5">
          <span className="text-ink-light">Tracking Number: </span>
          <span className="font-semibold tabular-nums">{order.tracking_number}</span>
          {order.courier_name && <span className="text-ink-light"> via {order.courier_name}</span>}
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-semibold text-sm mb-2">Delivering To</h3>
        <p className="text-sm text-ink-light">
          {delivery.full_name} · {delivery.phone}
          <br />
          {delivery.address}, {delivery.city}
          {delivery.province ? `, ${delivery.province}` : ""}
        </p>
        <a
          href={googleMapsUrl(delivery.address, delivery.city, delivery.province)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-xs font-semibold text-mango-orange mt-1.5"
        >
          View on Google Maps ↗
        </a>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-sm mb-2">Items</h3>
        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span>
                {item.name} ({getOrderItemVariantLabel(item)}) × {item.qty}
              </span>
              <span>{formatPKR(item.unit_price * item.qty)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border-subtle pt-3 flex justify-between font-bold tabular-nums">
        <span>Total</span>
        <span className="text-mango-orange">{formatPKR(order.total)}</span>
      </div>
    </div>
  );
}
