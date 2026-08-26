import { createClient } from "@/lib/supabase/server";
import { getGiftOrdersForCurrentUser, getReviewedProductIdsForCurrentUser } from "@/lib/queries/orders";
import { OrderCard } from "@/components/account/order-card";
import { EmptyState } from "@/components/account/empty-state";

type OrderItem = { product_id: string };

export default async function GiftsPage() {
  const supabase = await createClient();
  const [orders, reviewedProductIds] = await Promise.all([
    getGiftOrdersForCurrentUser(),
    getReviewedProductIdsForCurrentUser(),
  ]);

  const productIds = [
    ...new Set(
      orders.flatMap((o) => ((o.items as OrderItem[] | null) ?? []).map((i) => i.product_id))
    ),
  ];

  const productSlugs = new Map<string, string>();
  const productImages = new Map<string, string | null>();
  if (productIds.length > 0) {
    const { data: products } = await supabase
      .from("products")
      .select("id, slug, image")
      .in("id", productIds);
    for (const p of products ?? []) {
      productSlugs.set(p.id, p.slug);
      productImages.set(p.id, p.image);
    }
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold mb-1">Gift Orders</h1>
      <p className="text-sm text-ink-light mb-6">
        Orders you&apos;ve sent as a gift to someone else — checked &ldquo;This is a gift&rdquo; at checkout.
      </p>
      {orders.length === 0 ? (
        <EmptyState
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 12 20 22 4 22 4 12" />
              <rect x="2" y="7" width="20" height="5" />
              <line x1="12" y1="22" x2="12" y2="7" />
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
            </svg>
          }
          title="No gifts sent yet"
          message="Check 'This is a gift' at checkout to send an order straight to someone else's door."
          actionHref="/#shop"
          actionLabel="Browse Products"
        />
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="flex flex-col gap-2">
              <div className="bg-mango-orange/10 border border-mango-orange/20 rounded-xl px-4 py-2.5 text-sm">
                <span className="font-semibold">🎁 For {order.gift_recipient_name}</span>
                {order.gift_message && (
                  <p className="text-ink-light italic mt-1">&ldquo;{order.gift_message}&rdquo;</p>
                )}
              </div>
              <OrderCard
                order={order}
                productSlugs={productSlugs}
                productImages={productImages}
                reviewedProductIds={reviewedProductIds}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
