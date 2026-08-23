"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { GlassCard } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";

type TestimonialReview = {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  product: { name: string; slug: string } | { name: string; slug: string }[] | null;
  profile: { name: string | null } | { name: string | null }[] | null;
};

// Real reviews only -- no seeded/fake testimonials. The store is early, so
// this list may be short; it renders however many genuine reviews exist
// rather than padding the grid, and disappears entirely once there are none.
export function Testimonials({ reviews }: { reviews: TestimonialReview[] }) {
  if (reviews.length === 0) return null;

  return (
    <Section aria-label="Customer reviews" className="bg-gradient-to-b from-[var(--color-cream-warm)] to-[#FBEFDC]">
      <Heading eyebrow="Real Customers" title="What They're Saying" center className="mb-14" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review, index) => {
          const product = Array.isArray(review.product) ? review.product[0] : review.product;
          const profile = Array.isArray(review.profile) ? review.profile[0] : review.profile;
          return (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
            >
              <GlassCard className="p-7 h-full flex flex-col">
                <div className="flex gap-0.5 text-[var(--color-golden)] mb-3" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4"
                      fill="currentColor"
                      strokeWidth={0}
                      style={{ opacity: i < review.rating ? 1 : 0.25 }}
                    />
                  ))}
                </div>
                {review.title && (
                  <div className="font-serif font-bold text-lg text-[var(--color-mango-deep)] mb-1">
                    {review.title}
                  </div>
                )}
                <p className="text-[var(--color-ink)]/80 leading-relaxed flex-1">&ldquo;{review.body}&rdquo;</p>
                <div className="mt-5 pt-4 border-t border-[var(--color-mango-deep)]/10 text-sm">
                  <span className="font-semibold text-[var(--color-mango-deep)]">
                    {profile?.name ?? "Verified Customer"}
                  </span>
                  {product && <span className="text-[var(--color-ink)]/60"> · {product.name}</span>}
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
