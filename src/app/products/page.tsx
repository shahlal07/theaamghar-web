import type { Metadata } from "next";
import { getPublishedProducts } from "@/lib/queries/products";
import { getSiteChrome } from "@/lib/queries/site";
import { getSiteContent } from "@/lib/queries/site-content";
import { ProductGrid } from "@/components/product-grid";

export async function generateMetadata(): Promise<Metadata> {
  const { productsPage } = await getSiteContent();
  return { title: productsPage.title, description: productsPage.metaDescription };
}

// A dedicated listing separate from the homepage's #shop section -- the
// homepage strip only ever shows a handful of featured products, this shows
// the full published catalog with the existing search/filter/sort UI.
export default async function ProductsPage() {
  const [products, { settings }, content] = await Promise.all([
    getPublishedProducts(),
    getSiteChrome(),
    getSiteContent(),
  ]);

  return (
    <div className="px-[5%] py-10 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="font-serif text-3xl font-bold mb-2">{content.productsPage.title}</h1>
        <p className="text-ink-light">{content.productsPage.intro}</p>
      </div>
      {products.length === 0 ? (
        <p className="text-center text-ink-light">{content.emptyStates.productsEmpty}</p>
      ) : (
        <ProductGrid
          products={products}
          whatsappNumber={settings?.support_whatsapp}
          paymentBadgeText={content.brand.paymentBadgeText}
        />
      )}
    </div>
  );
}
