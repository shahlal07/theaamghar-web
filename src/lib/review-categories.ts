import type { SiteContent } from "@/lib/site-content-defaults";

// Single source of truth for the 4 review sub-rating categories, keyed by
// their fixed DB columns (taste_rating/freshness_rating/packaging_rating/
// delivery_rating aren't renameable) -- only the display label is
// admin-editable via site_content.reviewCategories. Was previously two
// separately hardcoded label lists (review-form.tsx + product/[slug]/page.tsx)
// that could silently drift out of sync.
export function reviewCategoryList(reviewCategories: SiteContent["reviewCategories"]) {
  return [
    { field: "tasteRating", column: "taste_rating", label: reviewCategories.tasteLabel },
    { field: "freshnessRating", column: "freshness_rating", label: reviewCategories.freshnessLabel },
    { field: "packagingRating", column: "packaging_rating", label: reviewCategories.packagingLabel },
    { field: "deliveryRating", column: "delivery_rating", label: reviewCategories.deliveryLabel },
  ] as const;
}
