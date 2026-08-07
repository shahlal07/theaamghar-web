# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Read this first: Next.js 16, not the Next.js in your training data

This project runs **Next.js 16.2 + React 19.2**, installed after most models' training cutoff. Conventions differ from what you likely expect — check `node_modules/next/dist/docs/01-app/` before relying on memory, especially for anything involving routing, caching, or middleware. Two that already mattered here:

- The `middleware.ts` convention is deprecated in favor of `src/proxy.ts` exporting `proxy()`, not `middleware()` (see `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md`). This repo uses `proxy.ts`.
- `cookies()`, `headers()`, `params`, and `searchParams` are **always async** now — no synchronous fallback. Every `page.tsx`/`layout.tsx` receiving `params`/`searchParams` must `await` them.
- `eslint-config-next` now ships a `react-hooks/set-state-in-effect` rule that flags the old "reset state, then fetch, then setState" and "hydrate from localStorage in a useEffect" patterns. Don't disable it — the correct fix (used throughout `src/lib/use-synced-local-storage.ts`, `cart-context.tsx`, `theme-toggle.tsx`) is `useSyncExternalStore`, or for async fetches, a stale-while-revalidate approach that never synchronously resets to a loading state inside the effect body (see `cart-sidebar.tsx`).
- **Known-harmless console warning**: `next/script` with `strategy="beforeInteractive"` (used for the pre-paint theme script in `layout.tsx`) logs a generic react-dom DEV warning — *"Encountered a script tag while rendering React component..."* — on client render. The script already executed correctly via Next's SSR-time injection before hydration; this is react-dom not recognizing that and warning generically about literal `<script>` JSX. Verified functionally harmless (theme still applies correctly); don't spend time re-chasing it.
- **Dev-tool gotcha, not a code issue**: the Browser pane's `read_console_messages` returns *accumulated* console history for a tab's entire lifetime, not just the latest navigation. In a long-lived tab this makes old, already-fixed warnings (a stale `data-theme` hydration mismatch, a duplicate-React-key warning from before a dedupe fix) keep reappearing on every check, looking like live bugs that survived a fix. If a warning seems to persist unchanged across multiple otherwise-clean reloads, open a brand-new tab and re-check there before spending time chasing it further.
- **Dev-tool gotcha, not a code issue**: `/login` and `/signup` can appear permanently stuck in the Browser pane sandbox — `<main id="main">` stays as an unresolved Suspense placeholder (`<!--$~--><template id="B:0"></template><!--/$-->`) forever, no console error, no dev overlay. Root-caused (2026-08-04): both pages are `"use client"` components wrapped in a bare `<Suspense>` (no fallback) purely to satisfy `useSearchParams()` (see `LoginPage()`/`SignupPage()` in `src/app/login/page.tsx` / `src/app/signup/page.tsx`). React 19's streaming SSR sends the resolved form content inline in the same response (verified via `document.forms` / a11y tree — the fully-rendered login form *is* in the DOM) but it sits inert inside the Suspense boundary's hidden container until React's scheduler flushes the swap into `<main>`. That flush never runs because the sandboxed tab reports `document.visibilityState === "hidden"` and `document.hasFocus() === false` *for the entire session* (same root cause as the Browser pane's `screenshot` tool erroring "the pane is not displayed, so the page is not compositing frames") — Chromium throttles/never-fires the scheduler's timers for a tab that's never actually composited. Confirmed this is sandbox-only, not a real bug: (a) `/products` — which has no Suspense-swap dependency — renders fully in the exact same hidden/unfocused tab state, so "hidden tab" alone doesn't break rendering, only this specific deferred-swap pattern; (b) waiting 30s+ doesn't help, ruling out ordinary throttled-timer delay; (c) identical symptom reproduces on the deployed `https://theaamghar-web.vercel.app/login`, ruling out a dev-server-only streaming quirk. A real user's tab is visible/focused on load in the overwhelming common case, so the swap flushes within milliseconds there. If you hit this, don't "fix" `login/page.tsx` or `signup/page.tsx` — check `document.visibilityState`/`document.hasFocus()` via `javascript_tool` first to confirm it's this, not a regression.

## Project overview

TheAamGhar web app is the production rebuild of the static `Theaamghar` demo site (sibling directory, `../Theaamghar`) as a real Next.js + Supabase application — real auth, real database-backed orders, real RLS-enforced access control, replacing the old localStorage-only simulation. The static site remains the **visual/UX reference** during the port (colors, typography, page flows); it is not being deleted or edited as part of this work.

The backend audit and phased build plan live in `../Theaamghar/PRODUCTION_ROADMAP.md` — read it for *why* things are structured the way they are (e.g. why `orders` is owner-scoped by RLS instead of the old "anyone who knows the order ID can view it" pattern).

The full customer-facing storefront is built out: catalog with search/filters/compare, product pages (rich content, reviews with photos and sub-ratings, frequently-bought-together), cart (guest + account-synced via `cart_items`, free-shipping progress, coupon codes, recently-viewed), checkout, auth, order tracking, and a full account dashboard (orders, wishlist, addresses, reviews, notifications, profile). Check the session's TaskList for what's actually in progress at any given moment rather than assuming this list is exhaustive going forward.

## Critical: this Supabase project is shared with `../theaamghar-admin`

The database (`eznxsosvsgkhexbjoolh`, name `theaamghar`) is **not exclusive to this repo**. A separate, much more mature Next.js app at `E:\Claude\theaamghar-admin` (14 of 17 planned phases complete: inventory, coupons, analytics, reports, notifications, RLS-hardened) reads and writes the same tables and has extended the schema well beyond what this repo originally created — see its own `CLAUDE.md` for the full picture, especially the "Data conventions" section. Concretely, this means:

- **`product_box_sizes` is the real source of truth for sellable fruit variants and stock**, not `products.price`/`products.unit` (those columns still exist but are effectively legacy from this project's original schema pass — a product can have several box sizes at different prices, e.g. 3kg/5kg/8kg, each with its own `stock_qty`). Any catalog/cart/checkout code must join through `product_box_sizes`, not read `products.price` directly.
- **`products.product_type` (`'fruit' | 'clothing' | 'other'`) generalizes the catalog beyond mangoes** — added so the business can pivot categories from the admin panel without a rebuild. `fruit` is unchanged (still uses `product_box_sizes`, `origin`/`season`/`sweetness`/`fiber`/`weight_note`, `purchase_price_per_kg`); every other type uses **`product_variants`** (generic `attributes jsonb`, e.g. `{"size":"M","color":"Blue"}`, plus `selling_price`/`stock_qty`) as its variant table instead, `products.attributes jsonb` for type-specific product-level fields (e.g. clothing's fabric/fit/care_instructions/made_in), and `products.unit_cost` instead of `purchase_price_per_kg` for the profit calc. `src/lib/product-types.ts` (`buildSpecs()`) and `src/lib/variant-label.ts` (`variantLabel()`) are the shared helpers — reuse them rather than re-deriving display logic. `product_box_sizes` itself is untouched by this.
- **`orders.items` must be written as `{ product_id, name, variety, qty, unit_price, box_size_kg?, product_type, variant_id, variant_source, variant_label, variant_attributes }[]`** and **`orders.delivery` as `{ full_name, phone, address, city, postal_code, notes }`** — this exact shape is a documented contract the admin app depends on. `box_size_kg` is present (and required-in-practice) on every fruit line, old and new orders alike; non-fruit lines omit it and rely on `variant_label`/`variant_attributes` instead. `src/lib/order-item.ts`'s `OrderItem` type + `getOrderItemVariantLabel()` is the canonical shape — every reader of `orders.items` should import it rather than re-declaring a local type. Don't invent a different shape.
- **`cart_items` holds either `box_size_id` OR `variant_id` (never both, enforced by a CHECK)** — its old `PRIMARY KEY (profile_id, box_size_id)` was replaced with a synthetic `id` PK plus two partial unique indexes (`(profile_id, box_size_id) WHERE box_size_id IS NOT NULL` / same for `variant_id`), since a PK column can't be nullable. `CartItem` in `src/lib/cart-context.tsx` is `{ unitId, source?: 'box_size' | 'variant', qty }` — `source` defaults to `'box_size'` when absent so carts persisted before product types existed keep resolving correctly with no migration.
- **The stock/profit triggers (`adjust_stock_for_order_items`, `calculate_order_profit`) are product-type-aware and log instead of silently no-op**: an order line that can't be resolved to a real `product_box_sizes`/`product_variants` row (or is missing the expected keys) now inserts a row into `order_item_stock_warnings` (admin-readable) rather than silently skipping the stock adjustment or costing the line at 0. If stock/profit numbers ever look wrong, check that table first.
- `orders.status` is `pending | confirmed | packed | shipped | delivered | cancelled | refunded` (not the narrower set this repo's storefront-audit doc originally assumed).
- `shipping_zones` (province/city → delivery rate) and `business_settings` (singleton: tax %, default shipping cost, support contact info) are the real sources for checkout math and storefront contact info — prefer them over hardcoding values here.
- `coupons` is deliberately admin-only SELECT (no public read, so codes aren't enumerable) — checkout validates a code through the `validate_coupon(p_code, p_order_amount)` RPC (and records usage via `increment_coupon_usage`), never a direct table query.
- Before writing any migration or relying on a table/column shape from memory, re-run `list_tables`/`list_migrations` against project `eznxsosvsgkhexbjoolh` — the schema has moved twice already in one day from two different sessions and will keep moving.
- **Do not build another admin dashboard here.** That's what `theaamghar-admin` is for; this repo is the customer-facing storefront only.

## Critical: ambiguous PostgREST embeds fail *silently* in this codebase's query style

Every query helper in `src/lib/queries/*.ts` follows the pattern `const { data } = await supabase.from(...).select(...)` — destructuring only `data`, discarding `error`. This is fine for a simple query, but it means an embed (`select("...,profile:profiles(name)")`) that PostgREST rejects returns `data: null`, which every caller's `data ?? []` fallback turns into a silently empty result — no thrown error, no console output, nothing. A page just renders an empty list instead of a real one, with no signal that anything is wrong.

This actually happened: adding `review_helpful_votes` (which has FKs to both `reviews` and `profiles`) made the existing `profiles:profiles(name)` embed in `getReviewsForProduct` ambiguous — PostgREST returned a `PGRST201` error ("more than one relationship was found") instead of guessing, and the reviews list on every product page silently showed "No reviews yet" even though the reviews existed and RLS was correct. Found only by comparing a raw REST fetch (which surfaces the error) against the app's swallowed-error query. Fixed by pinning the specific FK: `profiles!reviews_profile_id_fkey(name)` instead of the ambiguous `profiles(name)`.

**Whenever a new table gets added anywhere in this shared schema (by this repo or by `theaamghar-admin`) that introduces a second foreign-key path between two tables already being embedded somewhere, every existing ambiguous embed between them breaks retroactively, silently, with no code change on this side.** If a list that should have data renders empty with no console error, suspect this before anything else — temporarily log `error` (not just `data`) from the query, or reproduce the exact `select=` string as a raw `fetch()` against `/rest/v1/<table>` to see PostgREST's real response.

## Commands

```
npm run dev      # start dev server (Turbopack, default in Next 16 — no flag needed)
npm run build    # production build
npm run start    # run a production build
npm run lint     # ESLint (flat config, eslint-config-next) — `next lint` was removed in Next 16
```

No test suite exists yet.

## Architecture

### Supabase: three client entry points, one reason

`@supabase/ssr` requires a different client depending on where code runs, because only some of these contexts can write cookies:

- **`src/lib/supabase/client.ts`** — `createBrowserClient`, for Client Components.
- **`src/lib/supabase/server.ts`** — `createServerClient`, for Server Components/Actions/Route Handlers. Its `setAll` is wrapped in `try/catch` because Server Components can't write cookies at all — session refresh there depends on the proxy below having already run.
- **`src/lib/supabase/middleware.ts`** (`updateSession`) — invoked from `src/proxy.ts` on every request. This is what actually keeps the auth session cookie fresh; the other two clients read/write but don't refresh.

`src/lib/supabase/types.ts` is generated output (Supabase `generate_typescript_types` against project `eznxsosvsgkhexbjoolh`, region `ap-southeast-1`) — regenerate rather than hand-edit when the schema changes.

Required env vars (`.env.local`, gitignored via the `.env*` pattern in `.gitignore`): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Both are safe to expose client-side — RLS is the actual access-control boundary, not key secrecy. Never put the Supabase *service role* key in a `NEXT_PUBLIC_*` var or client bundle.

### Tailwind v4: CSS-first config, no `tailwind.config.*`

This project uses Tailwind v4 (`@tailwindcss/postcss`). Theme customization happens via `@theme` blocks directly in `src/app/globals.css`, not a `tailwind.config.js`/`.ts` file — none exists, and none should be added.

The static site's design tokens (`../Theaamghar/css/base.css`) are already ported into `globals.css`: brand colors as `--color-*` custom properties (identical in light/dark by design — never move a brand color into the `[data-theme="dark"]` override block, only surface tokens like `--color-cream`/`--color-surface` belong there), `--radius-brand`/`--radius-brand-sm`, `--shadow-brand-*`, `--nav-height`. Dark mode is `data-theme="dark"` on `<html>` (manual toggle, persisted to `localStorage` under `od_theme`) with a `prefers-color-scheme` fallback for users who haven't chosen yet — same mechanism as the static site, applied via a `beforeInteractive` `next/script` in `src/app/layout.tsx` so there's no flash of the wrong theme on load.

Fonts (`Inter`, `Cormorant Garamond`) are self-hosted via `next/font/local` in `layout.tsx`, using the same `.woff2` files as the static site (copied into `src/fonts/`) — both are variable fonts, loaded with a weight *range* rather than one `next/font/local` call per static weight.
