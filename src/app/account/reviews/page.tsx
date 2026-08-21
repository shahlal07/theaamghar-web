import { getReviewsForCurrentUser } from "@/lib/queries/reviews";
import { ReviewManagementCard } from "@/components/account/review-management-card";
import { EmptyState } from "@/components/account/empty-state";

type AccountReview = Awaited<ReturnType<typeof getReviewsForCurrentUser>>[number];

export default async function AccountReviewsPage() {
  const reviews = await getReviewsForCurrentUser();

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold mb-6">My Reviews</h1>
      {reviews.length === 0 ? (
        <EmptyState
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          }
          title="No reviews yet"
          message="Once your mangoes are delivered, you can share what you thought — your reviews will show up here."
          actionHref="/account/orders"
          actionLabel="View Your Orders"
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {reviews.map((r: AccountReview) => (
            <ReviewManagementCard key={r.id} review={r} />
          ))}
        </div>
      )}
    </div>
  );
}
