import { createClient } from "@/lib/supabase/server";

export type DashboardStats = {
  totalOrders: number;
  totalSpent: number;
  favouriteVariety: string | null;
  reviewsWritten: number;
  wishlistCount: number;
};

type OrderItem = { name?: string; variety?: string; qty?: number };

// Every number here is derived from tables that already exist -- no new
// schema needed, and "favourite variety" is a real frequency count over
// orders.items (there's no separate "variety" dimension in the catalog,
// so item.variety === the product name, e.g. "Sindhri Mango" -- see
// checkout/actions.ts's comment on why).
export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const supabase = await createClient();

  const [ordersRes, reviewsRes, wishlistRes] = await Promise.all([
    supabase
      .from("orders")
      .select("total, status, items")
      .eq("customer_id", userId),
    supabase
      .from("reviews")
      .select("id", { count: "exact", head: true })
      .eq("profile_id", userId),
    supabase
      .from("wishlists")
      .select("product_id", { count: "exact", head: true })
      .eq("profile_id", userId),
  ]);

  const orders = ordersRes.data ?? [];
  const billableOrders = orders.filter(
    (o) => o.status !== "cancelled" && o.status !== "refunded"
  );

  const varietyCounts = new Map<string, number>();
  for (const order of billableOrders) {
    const items = (order.items as OrderItem[] | null) ?? [];
    for (const item of items) {
      const variety = item.variety ?? item.name;
      if (!variety) continue;
      varietyCounts.set(variety, (varietyCounts.get(variety) ?? 0) + (item.qty ?? 1));
    }
  }
  let favouriteVariety: string | null = null;
  let maxCount = 0;
  for (const [variety, qty] of varietyCounts) {
    if (qty > maxCount) {
      favouriteVariety = variety;
      maxCount = qty;
    }
  }

  return {
    totalOrders: billableOrders.length,
    totalSpent: billableOrders.reduce((sum, o) => sum + Number(o.total), 0),
    favouriteVariety,
    reviewsWritten: reviewsRes.count ?? 0,
    wishlistCount: wishlistRes.count ?? 0,
  };
}
