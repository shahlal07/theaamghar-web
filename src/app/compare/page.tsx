import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { productImageSrc } from "@/lib/product-image";
import { formatPKR } from "@/lib/format";
import { buildSpecs } from "@/lib/product-types";
import { variantLabel } from "@/lib/variant-label";

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const { ids: idsParam } = await searchParams;
  const ids = (idsParam ?? "").split(",").filter(Boolean).slice(0, 4);

  const supabase = await createClient();
  const { data } = ids.length
    ? await supabase
        .from("products")
        .select(
          "id, slug, name, image, product_type, attributes, origin, season, sweetness, fiber, weight_note, rating_avg, review_count, product_box_sizes(box_size_kg, selling_price, active), product_variants(attributes, label, selling_price, active)"
        )
        .in("id", ids)
        .eq("status", "published")
    : { data: [] };

  // Preserve the order the customer selected them in, not whatever order
  // the .in() query happens to return.
  const products = ids
    .map((id) => data?.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (products.length < 2) {
    return (
      <div className="px-[5%] py-16 max-w-2xl mx-auto text-center">
        <div className="text-4xl mb-4" aria-hidden="true">
          ⚖️
        </div>
        <h1 className="font-serif text-2xl font-bold mb-2">Nothing to compare yet</h1>
        <p className="text-ink-light mb-6">
          Tap &quot;Compare&quot; on at least two products to see them side by side.
        </p>
        <Link href="/#shop" className="bg-mango-orange text-white font-semibold px-8 py-3 rounded-full">
          Browse Products
        </Link>
      </div>
    );
  }

  type Product = (typeof products)[number];

  // Raw Supabase rows type `attributes` as the generic `Json` union;
  // buildSpecs wants a plain object (or null), same coercion used
  // everywhere else this column is read.
  const specsOf = (p: Product) => buildSpecs({ ...p, attributes: (p.attributes ?? {}) as Record<string, unknown> });

  // Union of every spec label across the compared products (a mixed
  // fruit+clothing comparison shows both sets of rows, "—" for whichever
  // side doesn't define a given field) -- generalizes the old fixed
  // Origin/Season/Sweetness/Fiber/Weight row list into whatever each
  // product's own type actually defines.
  const specLabels = [...new Set(products.flatMap((p) => specsOf(p).map((s) => s.label)))];

  const rows: {
    label: string;
    render: (p: Product) => React.ReactNode;
  }[] = [
    {
      label: "Price",
      render: (p) => {
        const cheapestBox = p.product_box_sizes
          ?.filter((b) => b.active)
          .reduce<{ selling_price: number } | null>(
            (min, b) => (min === null || b.selling_price < min.selling_price ? b : min),
            null
          );
        const cheapestVariant = p.product_variants
          ?.filter((v) => v.active)
          .reduce<{ selling_price: number } | null>(
            (min, v) => (min === null || v.selling_price < min.selling_price ? v : min),
            null
          );
        const cheapest = cheapestBox ?? cheapestVariant;
        return cheapest ? `From ${formatPKR(cheapest.selling_price)}` : "Unavailable";
      },
    },
    {
      label: "Options",
      render: (p) => {
        const boxLabels = (p.product_box_sizes ?? [])
          .filter((b) => b.active)
          .map((b) => variantLabel({ kind: "box_size", box_size_kg: b.box_size_kg }));
        const variantLabels = (p.product_variants ?? [])
          .filter((v) => v.active)
          .map((v) => variantLabel({ kind: "variant", attributes: (v.attributes ?? {}) as Record<string, string>, label: v.label }));
        return [...boxLabels, ...variantLabels].join(", ") || "—";
      },
    },
    ...specLabels.map((label) => ({
      label,
      render: (p: Product) => specsOf(p).find((s) => s.label === label)?.value ?? "—",
    })),
    {
      label: "Rating",
      render: (p) => `${Number(p.rating_avg).toFixed(1)} ★ (${p.review_count})`,
    },
  ];

  return (
    <div className="px-[5%] py-10 max-w-5xl mx-auto">
      <h1 className="font-serif text-3xl font-bold mb-2">Compare Products</h1>
      <p className="text-ink-light mb-8">Find the perfect option for your needs</p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[500px]">
          <thead>
            <tr>
              <th className="text-left p-3 w-32"></th>
              {products.map((p) => (
                <th key={p.id} className="p-3 text-center align-top">
                  <Link href={`/product/${p.slug}`} className="inline-block">
                    <div className="relative w-20 h-20 mx-auto rounded-brand-sm overflow-hidden bg-cream-warm mb-2">
                      {p.image && (
                        <Image src={productImageSrc(p.image, 400)} alt={p.name} fill className="object-cover" sizes="80px" />
                      )}
                    </div>
                    <div className="font-serif font-bold text-sm hover:text-mango-orange">{p.name}</div>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.label} className={i % 2 === 0 ? "bg-cream-warm/40" : ""}>
                <td className="p-3 text-sm font-semibold text-ink-light">{row.label}</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 text-sm text-center">
                    {row.render(p)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
