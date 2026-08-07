import { createClient } from "@/lib/supabase/client";
import type { CartItem } from "@/lib/cart-context";
import { variantLabel } from "@/lib/variant-label";

export type CartLine = {
  unitId: string;
  source: "box_size" | "variant";
  productId: string;
  qty: number;
  name: string;
  slug: string;
  image: string | null;
  label: string;
  unitPrice: number;
  stockQty: number;
  lineTotal: number;
};

/* Cart items only carry {unitId, source, qty}; this resolves them against
   the live database so price/stock/name are always current, never a value
   cached at add-to-cart time. Silently drops lines whose unit no longer
   exists or was deactivated -- the caller renders whatever comes back, so a
   removed product just disappears from the cart rather than erroring the
   whole page. */
export async function resolveCartLines(items: CartItem[]): Promise<CartLine[]> {
  if (items.length === 0) return [];

  const supabase = createClient();
  const boxSizeItems = items.filter((i) => (i.source ?? "box_size") === "box_size");
  const variantItems = items.filter((i) => i.source === "variant");

  const [boxSizeResult, variantResult] = await Promise.all([
    boxSizeItems.length > 0
      ? supabase
          .from("product_box_sizes")
          .select(
            "id, box_size_kg, selling_price, stock_qty, active, product:products(id, name, slug, image, status)"
          )
          .in(
            "id",
            boxSizeItems.map((i) => i.unitId)
          )
          .eq("active", true)
      : Promise.resolve({ data: [], error: null }),
    variantItems.length > 0
      ? supabase
          .from("product_variants")
          .select(
            "id, attributes, label, selling_price, stock_qty, active, product:products(id, name, slug, image, status)"
          )
          .in(
            "id",
            variantItems.map((i) => i.unitId)
          )
          .eq("active", true)
      : Promise.resolve({ data: [], error: null }),
  ]);

  const qtyByUnit = new Map(items.map((i) => [i.unitId, i.qty]));

  const boxLines: CartLine[] = (boxSizeResult.data ?? [])
    .filter((row) => row.product && row.product.status === "published")
    .map((row) => {
      const qty = qtyByUnit.get(row.id) ?? 0;
      const unitPrice = Number(row.selling_price);
      return {
        unitId: row.id,
        source: "box_size" as const,
        productId: row.product!.id,
        qty,
        name: row.product!.name,
        slug: row.product!.slug,
        image: row.product!.image,
        label: variantLabel({ kind: "box_size", box_size_kg: Number(row.box_size_kg) }),
        unitPrice,
        stockQty: row.stock_qty,
        lineTotal: unitPrice * qty,
      };
    });

  const variantLines: CartLine[] = (variantResult.data ?? [])
    .filter((row) => row.product && row.product.status === "published")
    .map((row) => {
      const qty = qtyByUnit.get(row.id) ?? 0;
      const unitPrice = Number(row.selling_price);
      return {
        unitId: row.id,
        source: "variant" as const,
        productId: row.product!.id,
        qty,
        name: row.product!.name,
        slug: row.product!.slug,
        image: row.product!.image,
        label: variantLabel({
          kind: "variant",
          attributes: (row.attributes ?? {}) as Record<string, string>,
          label: row.label,
        }),
        unitPrice,
        stockQty: row.stock_qty,
        lineTotal: unitPrice * qty,
      };
    });

  return [...boxLines, ...variantLines];
}

export type ReorderItem = { product_id: string; box_size_kg?: number; variant_id?: string; qty: number };
export type ReorderResult = { addedCount: number; skippedCount: number };

/* "Buy Again": order.items snapshots identifying info but not a live
   unit id (units can be added/removed/repriced after the order was placed,
   so there's nothing stable to store) -- this re-resolves each line against
   the *current* product_box_sizes/product_variants to find a still-active
   match before adding to cart. Lines whose exact unit no longer exists are
   skipped (reported via skippedCount) rather than silently substituting
   something the customer didn't ask for. Variant lines without a
   deterministic re-match (e.g. the variant itself was deleted) are also
   skipped -- re-adding "the closest thing" for a differently-attributed
   item risks adding the wrong size/color, which is worse than asking the
   customer to re-pick it. */
export async function reorderItems(
  items: ReorderItem[],
  addItem: (unitId: string, qty: number, source?: "box_size" | "variant") => void
): Promise<ReorderResult> {
  if (items.length === 0) return { addedCount: 0, skippedCount: 0 };

  const supabase = createClient();
  const productIds = [...new Set(items.map((i) => i.product_id))];

  const [{ data: boxSizes }, { data: variants }] = await Promise.all([
    supabase
      .from("product_box_sizes")
      .select("id, product_id, box_size_kg, active")
      .in("product_id", productIds)
      .eq("active", true),
    supabase
      .from("product_variants")
      .select("id, product_id, active")
      .in("product_id", productIds)
      .eq("active", true),
  ]);

  let addedCount = 0;
  let skippedCount = 0;

  for (const item of items) {
    if (typeof item.box_size_kg === "number") {
      const match = (boxSizes ?? []).find(
        (row) => row.product_id === item.product_id && Number(row.box_size_kg) === item.box_size_kg
      );
      if (match) {
        addItem(match.id, item.qty, "box_size");
        addedCount++;
        continue;
      }
    } else if (item.variant_id) {
      const match = (variants ?? []).find(
        (row) => row.product_id === item.product_id && row.id === item.variant_id
      );
      if (match) {
        addItem(match.id, item.qty, "variant");
        addedCount++;
        continue;
      }
    }
    skippedCount++;
  }

  return { addedCount, skippedCount };
}
