// Canonical shape for a line in orders.items (jsonb array) -- the
// cross-repo contract documented in both apps' CLAUDE.md. box_size_kg is
// kept for every fruit line (old and new orders alike); the variant_*
// fields are new/additive, populated by checkout for every order placed
// from here on regardless of product type.
export type OrderItem = {
  product_id: string;
  name: string;
  variety: string;
  qty: number;
  unit_price: number;
  box_size_kg?: number;
  product_type?: string;
  variant_id?: string;
  variant_source?: "box_size" | "variant";
  variant_label?: string;
  variant_attributes?: Record<string, string | number>;
};

// Reproduces today's exact `${box_size_kg}kg` string for every order placed
// before product types existed (which never has variant_label); new orders
// carry a precomputed variant_label for both fruit and non-fruit lines.
export function getOrderItemVariantLabel(item: Pick<OrderItem, "box_size_kg" | "variant_label">): string {
  if (item.variant_label) return item.variant_label;
  if (typeof item.box_size_kg === "number") return `${item.box_size_kg}kg`;
  return "";
}
