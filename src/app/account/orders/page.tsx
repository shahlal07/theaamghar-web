import { createClient } from "@/lib/supabase/server";
import { getOrdersForCurrentUser, getReviewedProductIdsForCurrentUser } from "@/lib/queries/orders";
import { OrderCard } from "@/components/account/order-card";
import { EmptyState } from "@/components/account/empty-state";

type OrderItem = { product_id: string };

export default async function OrdersPage() {
  const supabase = await createClient();
  const [orders, reviewedProductIds] = await Promise.all([
    getOrdersForCurrentUser(),
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
      <h1 className="font-serif text-2xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <EmptyState
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          }
          title="No orders yet"
          message="Your future orders will show up here as beautiful cards you can track, reorder, and review from."
          actionHref="/#shop"
          actionLabel="Browse Products"
        />
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              productSlugs={productSlugs}
              productImages={productImages}
              reviewedProductIds={reviewedProductIds}
            />
          ))}
        </div>
      )}
    </div>
  );
}
