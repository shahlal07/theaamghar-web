import { Suspense } from "react";
import { CheckoutForm } from "@/components/checkout-form";
import { getSiteContent } from "@/lib/queries/site-content";

export default async function CheckoutPage() {
  const { emptyStates } = await getSiteContent();

  return (
    <div className="px-[5%] py-10 max-w-4xl mx-auto">
      {/* Heading is centred; the form below stays left-aligned on purpose --
          centring field labels/inputs hurts scannability and form completion. */}
      <h1 className="font-serif text-3xl font-bold mb-2 text-center">Checkout</h1>
      <p className="text-ink-light mb-8 text-center">
        You&apos;re almost there — review your order and confirm delivery details
      </p>
      <Suspense>
        <CheckoutForm emptyStates={emptyStates} />
      </Suspense>
    </div>
  );
}
