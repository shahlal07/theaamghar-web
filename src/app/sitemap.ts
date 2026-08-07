import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";
import { getPublishedProducts } from "@/lib/queries/products";

// Includes every published product page, not just the static routes -- those
// product pages are the ones that actually earn search traffic ("Sindhri
// mango online", "Chaunsa delivery Lahore"), and nothing was pointing
// crawlers at them before.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/track`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/compare`, changeFrequency: "monthly", priority: 0.3 },
  ];

  // A DB hiccup shouldn't produce a 500 on /sitemap.xml -- getPublishedProducts
  // already returns [] on error, so we just emit the static routes in that case.
  const products = await getPublishedProducts();
  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/product/${p.slug}`,
    lastModified: new Date(p.created_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
