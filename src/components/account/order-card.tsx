import Link from "next/link";
import Image from "next/image";
import { formatPKR } from "@/lib/format";
import { statusLabel, statusStyle } from "@/lib/order-status";
import { productImageSrc } from "@/lib/product-image";
import { BuyAgainButton } from "@/components/account/buy-again-button";
import { getOrderItemVariantLabel, type OrderItem } from "@/lib/order-item";
import type { Tables } from "@/lib/supabase/types";

export function OrderCard({
  order,
  productSlugs,
  productImages,
  reviewedProductIds,
}: {
  order: Tables<"orders">;
  productSlugs: Map<string, string>;
  productImages: Map<string, string | null>;
  reviewedProductIds: Set<string>;
}) {
  const items = (order.items as OrderItem[] | null) ?? [];
  const isDelivered = order.status === "delivered";
  const isTerminal = order.status === "cancelled" || order.status === "refunded";

  return (
    <div className="bg-surface border border-border-subtle rounded-2xl shadow-brand-sm overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-border-subtle bg-cream-warm/50">
        <div>
          <div className="font-semibold text-sm tabular-nums">{order.order_number}</div>
          <div className="text-xs text-ink-light">
            {new Date(order.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyle(order.status)}`}>
          {statusLabel(order.status)}
        </span>
        <div className="font-bold text-mango-orange tabular-nums">{formatPKR(order.total)}</div>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {items.map((item, idx) => {
          const image = productImages.get(item.product_id);
          const slug = productSlugs.get(item.product_id);
          const alreadyReviewed = reviewedProductIds.has(item.product_id);
          return (
            <div key={idx} className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-cream-warm shrink-0">
                {image && (
                  <Image src={productImageSrc(image, 400)} alt={item.name} fill className="object-cover" sizes="48px" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">{item.name}</div>
                <div className="text-xs text-ink-light">
                  {getOrderItemVariantLabel(item)} × {item.qty}
                </div>
              </div>
              {isDelivered && slug && (
                <Link
                  href={`/product/${slug}#reviews`}
                  className="text-xs font-semibold text-mango-orange whitespace-nowrap"
                >
                  {alreadyReviewed ? "Edit Review" : "Leave Review"}
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2 p-4 border-t border-border-subtle">
        {!isTerminal && (
          <Link
            href={`/track?order=${order.order_number}`}
            className="text-xs font-semibold text-ink border border-border-subtle rounded-full px-4 py-1.5 hover:border-mango-orange hover:text-mango-orange"
          >
            Track Order
          </Link>
        )}
        <BuyAgainButton
          items={items.map((i) => ({
            product_id: i.product_id,
            box_size_kg: i.box_size_kg,
            variant_id: i.variant_source === "variant" ? i.variant_id : undefined,
            qty: i.qty,
          }))}
        />
        <span
          title="Invoice downloads are coming soon"
          className="text-xs font-semibold text-ink-light border border-border-subtle rounded-full px-4 py-1.5 opacity-60 cursor-not-allowed ml-auto"
        >
          Download Invoice — Soon
        </span>
      </div>
    </div>
  );
}
