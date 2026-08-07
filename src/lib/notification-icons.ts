export const NOTIFICATION_ICONS: Record<string, string> = {
  order_placed: "🧾",
  order_shipped: "🚚",
  order_delivered: "🎉",
  order_cancelled: "✕",
  harvest_available: "🥭",
  coupon_expiring: "⏰",
  back_in_stock: "📦",
  price_drop: "💸",
  season_ending: "🍂",
};

export function notificationIcon(type: string) {
  return NOTIFICATION_ICONS[type] ?? "🔔";
}
