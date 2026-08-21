import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getProductBySlug } from "@/lib/queries/products";
import { getReviewsForProduct, getMyHelpfulVotedReviewIds } from "@/lib/queries/reviews";
import { getFrequentlyBoughtTogether } from "@/lib/queries/frequently-bought-together";
import { getSiteChrome } from "@/lib/queries/site";
import { getSiteContent } from "@/lib/queries/site-content";
import { reviewCategoryList } from "@/lib/review-categories";
import { buildSpecs } from "@/lib/product-types";
import { ProductPurchasePanel } from "@/components/product-purchase-panel";
import { ReviewForm } from "@/components/review-form";
import { ProductCareSection } from "@/components/product-care-section";
import { MiniProductCard } from "@/components/account/mini-product-card";
import { ReviewHelpfulButton } from "@/components/review-helpful-button";
import { starsHTML } from "@/lib/stars";
import { productImageSrc } from "@/lib/product-image";
import { SITE_URL, absoluteUrl } from "@/lib/site-url";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [product, { brand }] = await Promise.all([getProductBySlug(slug), getSiteContent()]);
  if (!product) return { title: "Product not found" };
  const description = product.tagline ?? `${product.name} from our orchards in ${product.origin ?? "Pakistan"} — delivered fresh within 24 hours, Cash on Delivery.`;
  const ogImage = product.image ? productImageSrc(product.image, 1000) : "/opengraph-image";
  return {
    title: product.name,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: { type: "website", title: `${product.name} — ${brand.logoText}`, description, url: `/product/${product.slug}`, images: [{ url: ogImage, alt: product.name }] },
    twitter: { card: "summary_large_image", title: `${product.name} — ${brand.logoText}`, description, images: [ogImage] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const [reviews, frequentlyBoughtTogether, { settings }, content] = await Promise.all([
    getReviewsForProduct(product.id),
    getFrequentlyBoughtTogether(product.id, product.slug),
    getSiteChrome(),
    getSiteContent(),
  ]);
  const myHelpfulVotes = await getMyHelpfulVotedReviewIds(reviews.map((r: { id: string }) => r.id));
  const subRatingLabels = reviewCategoryList(content.reviewCategories).map((c) => ({ key: c.column, label: c.label }));
  const images = Array.from(new Set([product.image, ...(product.gallery ?? [])].filter((img): img is string => Boolean(img))));
  const specs = buildSpecs(product);
  const purchasableUnits = [...product.boxSizes, ...product.variants];
  const inStock = purchasableUnits.some((u) => u.stock_qty > 0);
  const prices = purchasableUnits.map((u) => Number(u.selling_price));
  const productJsonLd = {
    "@context": "https://schema.org", "@type": "Product", name: product.name,
    description: product.tagline ?? undefined,
    image: product.image ? absoluteUrl(productImageSrc(product.image, 1000)) : undefined,
    brand: { "@type": "Brand", name: "TheAamGhar" },
    ...(product.origin ? { countryOfOrigin: product.origin } : {}),
    offers: prices.length ? { "@type": "AggregateOffer", lowPrice: Math.min(...prices), highPrice: Math.max(...prices), priceCurrency: "PKR", offerCount: prices.length, availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", url: `${SITE_URL}/product/${product.slug}` } : undefined,
  };
  return (
    <main>{/* existing product page markup */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <ProductPurchasePanel product={product} settings={settings} />
      <ProductCareSection specs={specs} />
      <MiniProductCard products={frequentlyBoughtTogether} />
      <ReviewHelpfulButton reviewIds={Array.from(myHelpfulVotes)} />
      <ReviewForm productId={product.id} />
    </main>
  );
}
