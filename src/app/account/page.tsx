import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getOrdersForCurrentUser } from "@/lib/queries/orders";
import { getDashboardStats } from "@/lib/queries/dashboard-stats";
import { getWishlistPreviewForCurrentUser } from "@/lib/queries/wishlist-server";
import { getSeasonalAnnouncement } from "@/lib/queries/seasonal";
import { getRecommendationsForCurrentUser } from "@/lib/queries/recommendations";
import { getNotificationsForCurrentUser } from "@/lib/queries/notifications";
import { getMangoCreditsForCurrentUser } from "@/lib/queries/bug-reports";
import { getSiteChrome } from "@/lib/queries/site";
import { getSiteContent } from "@/lib/queries/site-content";
import { formatPKR } from "@/lib/format";
import { statusLabel, statusStyle } from "@/lib/order-status";
import { StatCard } from "@/components/account/stat-card";
import { EmptyState } from "@/components/account/empty-state";
import { MiniProductCard } from "@/components/account/mini-product-card";
import { BuyAgainButton } from "@/components/account/buy-again-button";
import { VerifyEmailBanner } from "@/components/verify-email-banner";

function greetingForHour(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default async function AccountDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, orders, stats, wishlistPreview, seasonal, recommendations, notifications, { settings }, mangoCredits, content] =
    await Promise.all([
      supabase.from("profiles").select("name, email, email_verified_at").eq("id", user!.id).single(),
      getOrdersForCurrentUser(),
      getDashboardStats(user!.id),
      getWishlistPreviewForCurrentUser(4),
      getSeasonalAnnouncement(),
      getRecommendationsForCurrentUser(4),
      getNotificationsForCurrentUser(),
      getSiteChrome(),
      getMangoCreditsForCurrentUser(),
      getSiteContent(),
    ]);

  const firstName = profile?.name?.split(" ")[0] ?? "there";
  const showVerifyEmailBanner =
    !profile?.email_verified_at &&
    profile?.email &&
    settings?.welcome_discount_enabled &&
    settings?.welcome_discount_percent;
  const recentOrder = orders[0] ?? null;
  const recentNotifications = notifications.slice(0, 3);

  return (
    <div className="flex flex-col gap-8">
      {/* Greeting */}
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold">
          {greetingForHour(new Date().getHours())}, {firstName} 👋
        </h1>
        <p className="text-sm text-ink-light mt-1">
          Here&apos;s what&apos;s happening with your {content.brand.logoText} account.
        </p>
      </div>

      {/* Quick access -- moved up from the bottom of the page and shrunk to
          a compact row, since these (My Orders / Track / Addresses /
          Profile) are the links customers reach for first. */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {[
          { href: "/account/orders", label: "My Orders", emoji: "📦" },
          { href: "/track", label: "Track", emoji: "🚚" },
          { href: "/account/addresses", label: "Addresses", emoji: "📍" },
          { href: "/account/profile", label: "Profile", emoji: "👤" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-1 bg-surface border border-border-subtle rounded-xl py-2.5 px-1 text-center hover:border-mango-orange hover:-translate-y-0.5 transition-all min-h-[44px]"
          >
            <span className="text-lg" aria-hidden="true">
              {item.emoji}
            </span>
            <span className="text-[0.65rem] sm:text-xs font-semibold truncate w-full">{item.label}</span>
          </Link>
        ))}
      </div>

      {showVerifyEmailBanner && (
        <VerifyEmailBanner
          email={profile!.email!}
          discountPercent={Number(settings!.welcome_discount_percent)}
        />
      )}

      {/* Seasonal banner */}
      {seasonal && (
        <Link
          href={`/product/${seasonal.productSlug}`}
          className="flex items-center gap-4 bg-gradient-to-r from-mango-orange to-mango-deep text-white rounded-brand p-5 shadow-brand-md hover:-translate-y-0.5 transition-transform"
        >
          <span className="text-3xl" aria-hidden="true">
            {content.brand.accentEmoji}
          </span>
          <div className="flex-1">
            <div className="font-serif font-bold">
              {seasonal.productName} season is ending soon
            </div>
            <div className="text-sm text-white/85">
              Only {seasonal.daysRemaining} day{seasonal.daysRemaining === 1 ? "" : "s"} left in
              this harvest — order before it&apos;s gone.
            </div>
          </div>
          <span className="text-2xl font-bold font-sans shrink-0 tabular-nums">
            {seasonal.daysRemaining}d
          </span>
        </Link>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard
          label="Total Orders"
          value={String(stats.totalOrders)}
          accent="mango-orange"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          }
        />
        <StatCard
          label="Total Spent"
          value={formatPKR(stats.totalSpent)}
          accent="orchard-green"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          }
        />
        <StatCard
          label="Favourite Variety"
          value={stats.favouriteVariety ?? "—"}
          accent="golden"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2s5 4.5 5 10a5 5 0 0 1-10 0c0-5.5 5-10 5-10z" />
            </svg>
          }
        />
        <StatCard
          label="Reviews Written"
          value={String(stats.reviewsWritten)}
          accent="mango-orange"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          }
        />
        <StatCard
          label="Wishlist Items"
          value={String(stats.wishlistCount)}
          accent="orchard-green"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          }
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Recent order */}
          <section className="bg-surface border border-border-subtle rounded-2xl p-5 shadow-brand-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg font-bold">Recent Order</h2>
              <Link href="/account/orders" className="text-xs font-semibold text-mango-orange">
                View all →
              </Link>
            </div>
            {recentOrder ? (
              <div className="flex flex-wrap items-center gap-4 justify-between">
                <div>
                  <div className="font-semibold text-sm">{recentOrder.order_number}</div>
                  <div className="text-xs text-ink-light">
                    {new Date(recentOrder.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyle(recentOrder.status)}`}
                >
                  {statusLabel(recentOrder.status)}
                </span>
                <div className="font-bold text-mango-orange text-sm tabular-nums">
                  {formatPKR(recentOrder.total)}
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/track?order=${recentOrder.order_number}`}
                    className="text-xs font-semibold text-ink border border-border-subtle rounded-full px-4 py-1.5 hover:border-mango-orange hover:text-mango-orange"
                  >
                    Track
                  </Link>
                  <BuyAgainButton
                    items={
                      (recentOrder.items as {
                        product_id: string;
                        box_size_kg?: number;
                        variant_id?: string;
                        variant_source?: "box_size" | "variant";
                        qty: number;
                      }[]) ?? []
                    }
                  />
                </div>
              </div>
            ) : (
              <p className="text-sm text-ink-light">
                No orders yet.{" "}
                <Link href="/#shop" className="text-mango-orange font-semibold">
                  Start shopping
                </Link>
              </p>
            )}
          </section>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <section>
              <h2 className="font-serif text-lg font-bold mb-4">Recommended For You</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {recommendations.map((p) => (
                  <MiniProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="flex flex-col gap-6">
          {/* Notifications preview */}
          <section className="bg-surface border border-border-subtle rounded-2xl p-5 shadow-brand-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg font-bold">Notifications</h2>
              <Link href="/account/notifications" className="text-xs font-semibold text-mango-orange">
                View all →
              </Link>
            </div>
            {recentNotifications.length === 0 ? (
              <p className="text-sm text-ink-light">You&apos;re all caught up.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {recentNotifications.map((n) => (
                  <li key={n.id} className="flex items-start gap-2">
                    {!n.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-mango-orange mt-1.5 shrink-0" aria-hidden="true" />
                    )}
                    <div className={n.read ? "pl-3.5" : ""}>
                      <div className="text-sm font-semibold">{n.title}</div>
                      <div className="text-xs text-ink-light">{n.message}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Wishlist preview */}
          <section className="bg-surface border border-border-subtle rounded-2xl p-5 shadow-brand-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg font-bold">From Your Wishlist</h2>
              <Link href="/account/wishlist" className="text-xs font-semibold text-mango-orange">
                View all →
              </Link>
            </div>
            {wishlistPreview.length === 0 ? (
              <EmptyState
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                }
                title="Nothing saved yet"
                message="Tap the heart on any product to save it here."
                actionHref="/#shop"
                actionLabel="Browse Products"
              />
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {wishlistPreview.map((p) => (
                  <MiniProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </section>

          {/* Mango credits -- full earn/redeem system lives at
              /account/rewards (daily check-in, referrals, confirmed bug
              reports, redeem for coupons); this is just a dashboard glance. */}
          <section className="bg-gradient-to-br from-golden/20 to-cream-warm border border-golden/40 rounded-brand p-5">
            <div className="flex items-center gap-2 mb-1">
              <span aria-hidden="true">{content.loyaltyProgram.emoji}</span>
              <h2 className="font-serif text-sm font-bold">
                {mangoCredits} {mangoCredits === 1 ? content.loyaltyProgram.currencySingular : content.loyaltyProgram.currencyPlural}
              </h2>
            </div>
            <p className="text-xs text-ink-light">
              Check in daily, refer friends, or report bugs to earn more — then redeem for a
              discount coupon.
            </p>
            <Link
              href="/account/rewards"
              className="inline-block mt-2 text-xs font-semibold text-mango-orange"
            >
              Go to Rewards →
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
