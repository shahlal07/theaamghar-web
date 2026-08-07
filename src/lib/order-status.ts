// Matches theaamghar-admin's order status pipeline exactly (see its
// CLAUDE.md "Data conventions"): pending | confirmed | packed | shipped |
// delivered | cancelled | refunded.
export const STATUS_LABELS: Record<string, string> = {
  pending: "Processing",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export const STATUS_STYLES: Record<string, string> = {
  pending: "bg-golden/20 text-mango-deep",
  confirmed: "bg-mango-orange/10 text-mango-orange",
  packed: "bg-mango-orange/10 text-mango-orange",
  shipped: "bg-orchard-green/10 text-orchard-green",
  delivered: "bg-orchard-green/15 text-orchard-green",
  cancelled: "bg-error/10 text-error",
  refunded: "bg-error/10 text-error",
};

export function statusLabel(status: string) {
  return STATUS_LABELS[status] ?? status;
}

export function statusStyle(status: string) {
  return STATUS_STYLES[status] ?? "bg-border-subtle text-ink-light";
}
