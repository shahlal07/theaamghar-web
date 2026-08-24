"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Upload, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { uploadPaymentProof, type UploadProofState } from "@/app/track/actions";
import { getActivePaymentAccounts, type PaymentAccount } from "@/lib/queries/payment-accounts";
import { paymentIssueWhatsAppLink, paymentProofWhatsAppLink } from "@/lib/whatsapp";
import { formatPKR } from "@/lib/format";

const METHOD_LABELS: Record<string, string> = {
  bank: "Bank Transfer",
  easypaisa: "Easypaisa",
  jazzcash: "JazzCash",
};

// Only rendered for manual-payment orders (bank/easypaisa/jazzcash) -- a COD
// order has nothing to upload or verify.
export function PaymentProofPanel({
  orderNumber,
  paymentMethod,
  paymentStatus,
  paymentAccountId,
  rejectionReason,
  total,
  whatsappNumber,
  vendorId,
}: {
  orderNumber: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentAccountId: string | null;
  rejectionReason: string | null;
  total: number;
  whatsappNumber: string | null;
  vendorId: string;
}) {
  const [account, setAccount] = useState<PaymentAccount | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState<UploadProofState, FormData>(
    uploadPaymentProof,
    undefined
  );

  useEffect(() => {
    if (!paymentAccountId) return;
    getActivePaymentAccounts(vendorId).then((accounts) => {
      setAccount(accounts.find((a) => a.id === paymentAccountId) ?? null);
    });
  }, [paymentAccountId, vendorId]);

  // A successful upload changes payment_status server-side; reload so the
  // panel re-renders from the real row rather than a guessed local state.
  useEffect(() => {
    if (state && "success" in state) {
      const timer = setTimeout(() => window.location.reload(), 1200);
      return () => clearTimeout(timer);
    }
  }, [state]);

  if (paymentStatus === "paid") {
    return (
      <div className="rounded-2xl border border-orchard-green/30 bg-orchard-green/8 p-5 mb-6">
        <div className="flex items-center gap-2.5 font-semibold text-orchard-green">
          <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
          Payment verified
        </div>
        <p className="text-sm text-ink-light mt-1.5">
          We&apos;ve confirmed your {METHOD_LABELS[paymentMethod] ?? "transfer"} — your order is
          on its way through our kitchen and packing.
        </p>
      </div>
    );
  }

  const isSubmitted = paymentStatus === "submitted";
  const isRejected = paymentStatus === "rejected";

  return (
    <div className="rounded-2xl border border-border-subtle p-5 mb-6 bg-surface">
      <h3 className="font-serif text-lg font-bold mb-1">
        {METHOD_LABELS[paymentMethod] ?? "Payment"} — {formatPKR(total)}
      </h3>

      {isSubmitted && (
        <div className="flex items-start gap-2.5 text-sm text-ink-light mt-3 mb-4 bg-cream-warm rounded-xl p-3.5">
          <Clock className="w-4 h-4 mt-0.5 shrink-0 text-mango-orange" aria-hidden="true" />
          <span>
            <strong className="text-ink">Proof received — under review.</strong> We verify
            transfers manually, usually within a few hours. You can upload a new screenshot below
            if you need to replace it.
          </span>
        </div>
      )}

      {isRejected && (
        <div className="flex items-start gap-2.5 text-sm mt-3 mb-4 bg-error/10 rounded-xl p-3.5">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-error" aria-hidden="true" />
          <span>
            <strong className="text-error block mb-0.5">
              We couldn&apos;t verify this payment
            </strong>
            {rejectionReason ? (
              <span className="text-ink-light">{rejectionReason}</span>
            ) : (
              <span className="text-ink-light">
                There was a discrepancy with the payment proof.
              </span>
            )}
            {whatsappNumber && (
              <a
                href={paymentIssueWhatsAppLink(whatsappNumber, orderNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-2 font-semibold text-[#25D366] underline"
              >
                Contact us on WhatsApp →
              </a>
            )}
          </span>
        </div>
      )}

      {account && !isSubmitted && (
        <div className="text-sm bg-cream-warm rounded-xl p-4 my-4">
          <div className="text-xs text-ink-light mb-2">Transfer to</div>
          <div className="font-semibold">{account.account_title}</div>
          {account.bank_name && <div className="text-ink-light">{account.bank_name}</div>}
          <div className="tabular-nums font-semibold mt-1">{account.account_number}</div>
          {account.iban && (
            <div className="text-xs text-ink-light tabular-nums mt-0.5">{account.iban}</div>
          )}
        </div>
      )}

      <form ref={formRef} action={formAction} className="mt-4">
        <input type="hidden" name="orderNumber" value={orderNumber} />
        <label
          htmlFor="proof"
          className="flex items-center justify-center gap-2 border-[1.5px] border-dashed border-border-subtle rounded-xl px-4 py-5 text-sm cursor-pointer hover:border-mango-orange transition-colors"
        >
          <Upload className="w-4 h-4 text-mango-orange" aria-hidden="true" />
          {fileName ?? "Choose payment screenshot or receipt"}
        </label>
        <input
          id="proof"
          name="proof"
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          required
          className="sr-only"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
        />
        <p className="text-xs text-ink-light mt-2">JPG, PNG, WebP or PDF · max 5MB</p>

        {state && "error" in state && <p className="text-sm text-error mt-3">{state.error}</p>}
        {state && "success" in state && (
          <p className="text-sm text-orchard-green mt-3">
            ✓ Uploaded — we&apos;ll verify it shortly.
          </p>
        )}

        <button
          type="submit"
          disabled={pending || !fileName}
          className="w-full mt-4 bg-mango-orange text-white font-semibold py-3 rounded-full transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {pending
            ? "Uploading…"
            : isSubmitted || isRejected
              ? "Upload a new proof"
              : "Upload payment proof"}
        </button>
      </form>

      {whatsappNumber && !isSubmitted && (
        <p className="text-xs text-ink-light mt-3 text-center">
          Prefer WhatsApp?{" "}
          <a
            href={paymentProofWhatsAppLink(whatsappNumber, orderNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#25D366] underline"
          >
            Send your screenshot there instead →
          </a>
        </p>
      )}
    </div>
  );
}
