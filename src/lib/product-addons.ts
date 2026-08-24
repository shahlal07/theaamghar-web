export type AddonOption = { id: string; label: string };
export type AddonPricingTier = { count: number; price: number };
export type AddonGroup = {
  id: string;
  name: string;
  options: AddonOption[];
  pricingTiers: AddonPricingTier[];
  note?: string;
};

// A product's optional add-ons (toppings, extras, etc.) live in
// products.attributes.addon_groups (jsonb) -- no dedicated table, since this
// is a small, admin-curated per-product config, not a system needing its own
// CRUD surface. Any vendor/category can use this; nothing here is specific
// to a particular vendor.
export function getAddonGroups(attributes: Record<string, unknown> | null | undefined): AddonGroup[] {
  const groups = (attributes as { addon_groups?: unknown } | null)?.addon_groups;
  if (!Array.isArray(groups)) return [];
  return groups as AddonGroup[];
}

// Flat pricing (not per-selection-multiplied): the tier matching the exact
// selected count applies, e.g. "any 2 toppings = Rs 50" regardless of which
// 2. Falls back to the nearest lower tier if the exact count isn't listed,
// and to 0 if the group has no tiers at all (free add-ons).
export function priceForSelection(group: AddonGroup, selectedCount: number): number {
  if (group.pricingTiers.length === 0) return 0;
  const sorted = [...group.pricingTiers].sort((a, b) => a.count - b.count);
  let price = 0;
  for (const tier of sorted) {
    if (tier.count <= selectedCount) price = tier.price;
  }
  return price;
}

export function addonSelectionLabel(groups: AddonGroup[], selections: Record<string, string[]>): string {
  const parts: string[] = [];
  for (const group of groups) {
    const selectedIds = selections[group.id] ?? [];
    if (selectedIds.length === 0) continue;
    const labels = group.options.filter((o) => selectedIds.includes(o.id)).map((o) => o.label);
    if (labels.length > 0) parts.push(labels.join(", "));
  }
  return parts.join(" · ");
}

export function totalAddonPrice(groups: AddonGroup[], selections: Record<string, string[]>): number {
  return groups.reduce((sum, group) => {
    const selectedCount = (selections[group.id] ?? []).length;
    return sum + priceForSelection(group, selectedCount);
  }, 0);
}
