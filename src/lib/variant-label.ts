// Normalizes the two purchasable-unit shapes (fruit's product_box_sizes,
// everything else's product_variants) into one display string. Mirrors
// theaamghar-admin's identical helper (cross-repo duplication convention).
export type PurchasableUnit =
  | { kind: "box_size"; box_size_kg: number }
  | { kind: "variant"; attributes: Record<string, string>; label?: string | null };

export function variantLabel(unit: PurchasableUnit): string {
  if (unit.kind === "box_size") return `${unit.box_size_kg}kg`;
  if (unit.label) return unit.label;
  const values = Object.values(unit.attributes).filter(Boolean);
  return values.length > 0 ? values.join(" / ") : "Standard";
}
