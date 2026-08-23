// Single source of truth for the site's public origin.
//
// Every absolute URL the app emits (email links, OG tags, sitemap, canonical
// URLs, JSON-LD) goes through here so moving to a real domain later is one
// env var -- NEXT_PUBLIC_SITE_URL -- rather than a find-replace across the
// codebase. Falls back to the current Vercel production URL, so nothing
// breaks until that domain actually exists.
//
// Must be NEXT_PUBLIC_ because OG/canonical tags are also needed in Client
// Components and at build time, not just on the server.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://vendor-storefronts.vercel.app"
).replace(/\/$/, "");

// The admin panel, linked from admin alert emails. Separate var because it
// will likely live on a subdomain (admin.theaamghar.pk) rather than a path.
export const ADMIN_URL = (
  process.env.NEXT_PUBLIC_ADMIN_URL ?? "https://vendor-admins.vercel.app"
).replace(/\/$/, "");

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
