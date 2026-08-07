"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { productImageSrc } from "@/lib/product-image";
import { updateOwnReview, deleteOwnReview } from "@/app/account/reviews/actions";
import type { getReviewsForCurrentUser } from "@/lib/queries/reviews";

type Review = Awaited<ReturnType<typeof getReviewsForCurrentUser>>[number];

export function ReviewManagementCard({ review }: { review: Review }) {
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(review.rating);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Calling the action directly (rather than useActionState) so the form
  // can be closed straight from the result of awaiting it -- doing that
  // from an effect watching useActionState's state would be a
  // setState-in-effect cascading-render anti-pattern (see checkout-form.tsx
  // for a case where that pattern actually was justified; this isn't one).
  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateOwnReview(review.id, undefined, formData);
      if (result && "error" in result) {
        setError(result.error);
      } else {
        setError(null);
        setEditing(false);
      }
    });
  }

  const product = review.product;

  return (
    <div className="bg-surface border border-border-subtle rounded-brand p-5">
      <div className="flex items-center gap-3 mb-3">
        {product?.image && (
          <div className="relative w-12 h-12 rounded-brand-sm overflow-hidden bg-cream-warm shrink-0">
            <Image src={productImageSrc(product.image, 400)} alt={product.name} fill className="object-cover" sizes="48px" />
          </div>
        )}
        <div className="min-w-0">
          {product && (
            <Link href={`/product/${product.slug}`} className="text-sm font-semibold hover:text-mango-orange">
              {product.name}
            </Link>
          )}
          <div className="text-xs text-ink-light">
            {new Date(review.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            {review.verified_purchase && <span className="text-orchard-green ml-2">✓ Verified Purchase</span>}
          </div>
        </div>
      </div>

      {editing ? (
        <form action={handleSubmit} className="flex flex-col gap-3">
          <input type="hidden" name="rating" value={rating} />
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                aria-pressed={rating === n}
                className={`text-xl leading-none ${n <= rating ? "text-mango-orange" : "text-border-subtle"}`}
              >
                ★
              </button>
            ))}
          </div>
          <input
            name="title"
            defaultValue={review.title ?? ""}
            placeholder="Title (optional)"
            maxLength={120}
            className="w-full border border-border-subtle rounded-brand-sm px-3 py-2 text-sm"
          />
          <textarea
            name="body"
            required
            defaultValue={review.body}
            maxLength={2000}
            rows={3}
            className="w-full border border-border-subtle rounded-brand-sm px-3 py-2 text-sm"
          />
          {error && <p className="text-sm text-error">{error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={pending}
              className="bg-mango-orange text-white text-xs font-semibold px-5 py-2 rounded-full disabled:opacity-60"
            >
              {pending ? "Saving…" : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setEditing(false);
              }}
              className="text-xs font-semibold text-ink-light border border-border-subtle rounded-full px-5 py-2"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="text-mango-orange text-sm mb-1" aria-label={`${review.rating} out of 5 stars`}>
            {"★".repeat(review.rating)}
            <span className="text-border-subtle">{"★".repeat(5 - review.rating)}</span>
          </div>
          {review.title && <div className="font-semibold text-sm mb-1">{review.title}</div>}
          <p className="text-sm text-ink-light">{review.body}</p>

          <div className="flex gap-2 mt-4 pt-4 border-t border-border-subtle">
            <button
              type="button"
              onClick={() => {
                setRating(review.rating);
                setEditing(true);
              }}
              className="text-xs font-semibold text-ink border border-border-subtle rounded-full px-4 py-1.5 hover:border-mango-orange hover:text-mango-orange"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm("Delete this review?")) deleteOwnReview(review.id);
              }}
              className="text-xs font-semibold text-ink-light border border-border-subtle rounded-full px-4 py-1.5 hover:border-error hover:text-error"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
