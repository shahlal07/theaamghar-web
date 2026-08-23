// Mirrors vendor-admins's src/lib/product-types.ts (same cross-repo
// duplication convention as site-content-defaults.ts) -- a bounded,
// code-defined set of product types rather than a DB-driven dynamic field
// system, since this is a single-vendor business adding at most a handful
// of real categories. Adding a real new type later is a small additive PR
// here, not a rebuild.
export type ProductType = "fruit" | "clothing" | "other";

export type SpecField =
  | { key: string; label: string; source: "column"; column: string }
  | { key: string; label: string; source: "attribute"; attrKey: string };

// Drives the product detail page's spec grid and the compare page's rows.
// For 'fruit' this reproduces the exact 5 fields/order this app already
// hardcoded before product types existed -- byte-identical output for the
// live catalog, since every existing product classifies as 'fruit'.
export const PRODUCT_TYPE_SPECS: Record<ProductType, SpecField[]> = {
  fruit: [
    { key: "origin", label: "Origin", source: "column", column: "origin" },
    { key: "season", label: "Season", source: "column", column: "season" },
    { key: "sweetness", label: "Sweetness", source: "column", column: "sweetness" },
    { key: "fiber", label: "Fiber", source: "column", column: "fiber" },
    { key: "weight", label: "Weight", source: "column", column: "weight_note" },
  ],
  clothing: [
    { key: "fabric", label: "Fabric", source: "attribute", attrKey: "fabric" },
    { key: "fit", label: "Fit", source: "attribute", attrKey: "fit" },
    { key: "care", label: "Care Instructions", source: "attribute", attrKey: "care_instructions" },
    { key: "made_in", label: "Made In", source: "attribute", attrKey: "made_in" },
  ],
  other: [],
};

type SpecSourceProduct = {
  product_type: string;
  attributes: Record<string, unknown> | null;
  origin?: string | null;
  season?: string | null;
  sweetness?: string | null;
  fiber?: string | null;
  weight_note?: string | null;
};

// Filters out any field with no value, same as this app's original
// hardcoded `specs` array did -- a product/type missing a given field just
// omits that row rather than showing an empty one.
export function buildSpecs(product: SpecSourceProduct): { label: string; value: string }[] {
  const type = (product.product_type as ProductType) in PRODUCT_TYPE_SPECS
    ? (product.product_type as ProductType)
    : "fruit";
  const fields = PRODUCT_TYPE_SPECS[type];
  const attrs = product.attributes ?? {};
  return fields
    .map((f) => {
      const value = f.source === "column" ? (product as Record<string, unknown>)[f.column] : attrs[f.attrKey];
      return { label: f.label, value: typeof value === "string" ? value : null };
    })
    .filter((s): s is { label: string; value: string } => Boolean(s.value));
}
