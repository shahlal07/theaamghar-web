import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Account/checkout pages are per-customer and auth-gated -- there's
      // nothing for a crawler to index, and /auth holds OAuth callbacks.
      disallow: ["/account/", "/checkout", "/auth/", "/api/", "/reset-password", "/forgot-password"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
