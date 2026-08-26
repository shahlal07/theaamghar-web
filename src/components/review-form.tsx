"use client";

import { useActionState, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { useUser } from "@/lib/use-user";
import { createClient as createBrowserSupabaseClient } from "@/lib/supabase/client";
import { submitReview } from "@/app/product/[slug]/actions";
import { reviewCategoryList } from "@/lib/review-categories";
import type { SiteContent } from "@/lib/site-content-defaults";

type ActionResult = { error?: string; success?: boolean } | null;

export function ReviewForm({
  productId,
  productSlug,
  reviewCategories,
}: {
  productId: string;
  productSlug: string;
  reviewCategories: SiteContent["reviewCategories"];
}) {
  const { user, loading } = useUser();
  const [rating, setRating] = useState(5);
  const [subRatings, setSubRatings] = useState<Record<string, number>>({});
  const SUB_RATINGS = reviewCategoryList(reviewCategories);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(
    async (_prev, formData) => submitReview(formData),
    null
  );
  const formRef = useRef<HTMLFormElement>(null);
  // Guest reviews: submitReview only ever required *a* session (real or
  // anonymous) to satisfy reviews.customer_id, same as checkout's own
  // guest flow -- signInAnonymously() then re-submitting was the only
  // piece actually missing here; the "Sign in to leave a review" gate was
  // stricter than the backend needed.
  const guestSessionRef = useRef(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (user || loading || guestSessionRef.current) return;
    e.preventDefault();
    const form = e.currentTarget;
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.signInAnonymously();
    if (!error) {
      guestSessionRef.current = true;
      form.requestSubmit();
    }
  }

  if (loading) return null;

  if (state?.success) {
    return (
      <p className="text-sm bg-cream-warm rounded-brand-sm p-4">
        Thanks for your review! It&apos;s posted below.
      </p>
    );
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 4);
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
  }

  return (
    <form ref={formRef} action={formAction} onSubmit={handleSubmit} className="border border-border-subtle rounded-brand-sm p-5">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="productSlug" value={productSlug} />
      <input type="hidden" name="rating" value={rating} />

      <div className="mb-3">
        <span className="text-sm font-medium block mb-1">Your rating</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              aria-pressed={rating === n}
              className={`text-2xl leading-none ${n <= rating ? "text-mango-orange" : "text-border-subtle"}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="title" className="text-sm font-medium block mb-1">
          Title (optional)
        </label>
        <input
          id="title"
          name="title"
          type="text"
          maxLength={120}
          className="w-full border border-border-subtle rounded-brand-sm px-3 py-2 text-sm"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="body" className="text-sm font-medium block mb-1">
          Your review
        </label>
        <textarea
          id="body"
          name="body"
          required
          maxLength={2000}
          rows={4}
          className="w-full border border-border-subtle rounded-brand-sm px-3 py-2 text-sm"
        />
      </div>

      <details className="mb-3">
        <summary className="text-sm font-medium cursor-pointer text-ink-light">
          Add photos &amp; detailed ratings (optional)
        </summary>
        <div className="mt-3 flex flex-col gap-3">
          <div>
            <span className="text-xs font-medium block mb-1">Photos (up to 4)</span>
            {/* Was a bare, unstyled <input type=file> -- browsers render that
                as a plain "Choose Files" text link with no visual weight at
                all. Same dashed-border styled-label pattern already used for
                payment-proof uploads, so file pickers look consistent
                sitewide. */}
            <label
              htmlFor="images"
              className="flex items-center justify-center gap-2 border-[1.5px] border-dashed border-border-subtle rounded-brand-sm px-4 py-3 text-xs font-medium cursor-pointer hover:border-mango-orange transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-mango-orange" aria-hidden="true" />
              {imagePreviews.length > 0
                ? `${imagePreviews.length} photo${imagePreviews.length > 1 ? "s" : ""} selected`
                : "Add photos"}
            </label>
            <input
              id="images"
              name="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="sr-only"
            />
            {imagePreviews.length > 0 && (
              // eslint-disable-next-line @next/next/no-img-element -- transient client-side object URLs, not a next/image-optimizable source
              <div className="flex gap-2 mt-2">
                {imagePreviews.map((src, i) => (
                  <img key={i} src={src} alt="" className="w-14 h-14 rounded-brand-sm object-cover" />
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {SUB_RATINGS.map(({ field, label }) => (
              <div key={field}>
                <input type="hidden" name={field} value={subRatings[field] ?? ""} />
                <span className="text-xs font-medium block mb-1">{label}</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() =>
                        setSubRatings((prev) => ({
                          ...prev,
                          [field]: prev[field] === n ? 0 : n,
                        }))
                      }
                      aria-label={`${label}: ${n} star${n > 1 ? "s" : ""}`}
                      aria-pressed={subRatings[field] === n}
                      className={`text-base leading-none ${
                        n <= (subRatings[field] ?? 0) ? "text-mango-orange" : "text-border-subtle"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </details>

      {state?.error && <p className="text-sm text-error mb-3">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="bg-mango-orange text-white font-semibold px-6 py-2.5 rounded-full text-sm disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}
