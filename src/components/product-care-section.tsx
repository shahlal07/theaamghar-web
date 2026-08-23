// General mango nutrition facts (USDA-published averages, per 100g edible
// portion) -- deliberately not claimed as lab-tested for this specific
// variety/batch, since that testing doesn't exist. Phrased as "typical for
// fresh mango" rather than a product-specific claim.
const NUTRITION_FACTS = [
  { label: "Calories", value: "~60 kcal" },
  { label: "Vitamin C", value: "~36 mg (40% DV)" },
  { label: "Fiber", value: "~1.6 g" },
  { label: "Natural Sugars", value: "~14 g" },
];

export function ProductCareSection({
  productType,
  storageTip,
  ripeningTip,
  recipeSuggestions,
}: {
  productType: string;
  storageTip: string | null;
  ripeningTip: string | null;
  recipeSuggestions: string[];
}) {
  // No generic "nutrition facts" concept exists for a non-fruit product --
  // gate the whole (fruit-specific) block rather than showing mango
  // nutrition data on, say, a t-shirt.
  const isFruit = productType === "fruit";
  if (!storageTip && !ripeningTip && recipeSuggestions.length === 0 && !isFruit) return null;

  return (
    <div className="grid sm:grid-cols-2 gap-4 mb-8">
      {(storageTip || ripeningTip) && (
        <div className="bg-cream-warm rounded-brand p-5">
          <h3 className="font-serif font-bold text-sm mb-3">📦 Storage &amp; Ripening</h3>
          {ripeningTip && <p className="text-xs text-ink-light mb-3 leading-relaxed">{ripeningTip}</p>}
          {storageTip && <p className="text-xs text-ink-light leading-relaxed">{storageTip}</p>}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {recipeSuggestions.length > 0 && (
          <div className="bg-cream-warm rounded-brand p-5">
            <h3 className="font-serif font-bold text-sm mb-3">🍽️ Ways to Enjoy</h3>
            <div className="flex flex-wrap gap-2">
              {recipeSuggestions.map((r) => (
                <span
                  key={r}
                  className="text-xs font-semibold bg-surface text-mango-deep px-3 py-1.5 rounded-full"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        )}

        {isFruit && (
          <div className="bg-cream-warm rounded-brand p-5">
            <h3 className="font-serif font-bold text-sm mb-3">🌿 Nutrition (typical, per 100g)</h3>
            <div className="grid grid-cols-2 gap-2">
              {NUTRITION_FACTS.map((f) => (
                <div key={f.label}>
                  <div className="text-xs text-ink-light">{f.label}</div>
                  <div className="text-sm font-semibold">{f.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
