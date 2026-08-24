"use client";

import { useEffect, useState } from "react";
import { Building2, Smartphone, Wallet, Copy, Check, X } from "lucide-react";
import { getActivePaymentAccounts, type PaymentAccount } from "@/lib/queries/payment-accounts";
import { formatPKR } from "@/lib/format";

export type PaymentMethodValue = "cod" | "bank" | "easypaisa" | "jazzcash";

const METHOD_META: Record<
  Exclude<PaymentMethodValue, "cod">,
  { Icon: typeof Building2; blurb: string }
> = {
  bank: { Icon: Building2, blurb: "Transfer to our bank account" },
  easypaisa: { Icon: Smartphone, blurb: "Send via Easypaisa wallet" },
  jazzcash: { Icon: Wallet, blurb: "Send via JazzCash wallet" },
};

export function PaymentMethodSelector({
  value,
  onChange,
  total,
  vendorId,
}: {
  value: PaymentMethodValue;
  onChange: (value: PaymentMethodValue, accountId: string | null) => void;
  total: number;
  vendorId: string | null;
}) {
  const [accounts, setAccounts] = useState<PaymentAccount[] | null>(null);
  const [openAccount, setOpenAccount] = useState<PaymentAccount | null>(null);

  useEffect(() => {
    // Cart lines are still resolving -- wait for a real vendorId rather than
    // fetching every vendor's payment accounts (there's no other way to
    // scope this query client-side).
    if (!vendorId) return;
    getActivePaymentAccounts(vendorId).then(setAccounts);
  }, [vendorId]);

  // An account the admin hasn't activated (or hasn't filled in real details
  // for) simply isn't offered -- better to show only COD than to invite a
  // customer to transfer money to a placeholder account number.
  const available = accounts ?? [];

  return (
    <>
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => onChange("cod", null)}
          className={`text-left rounded-xl p-4 border-[1.5px] transition-colors ${
            value === "cod"
              ? "border-mango-orange bg-mango-orange/8"
              : "border-border-subtle hover:border-mango-orange/40"
          }`}
        >
          <div className="font-semibold text-sm">Cash on Delivery</div>
          <div className="text-xs text-ink-light">Pay in cash when your mangoes arrive</div>
        </button>

        {available.map((account) => {
          const meta = METHOD_META[account.method];
          const Icon = meta?.Icon ?? Building2;
          const selected = value === account.method;
          return (
            <button
              key={account.id}
              type="button"
              onClick={() => {
                onChange(account.method, account.id);
                setOpenAccount(account);
              }}
              className={`text-left rounded-xl p-4 border-[1.5px] transition-colors flex items-start gap-3 ${
                selected
                  ? "border-mango-orange bg-mango-orange/8"
                  : "border-border-subtle hover:border-mango-orange/40"
              }`}
            >
              <Icon className="w-5 h-5 mt-0.5 shrink-0 text-mango-orange" aria-hidden="true" />
              <span className="flex-1">
                <span className="block font-semibold text-sm">{account.label}</span>
                <span className="block text-xs text-ink-light">
                  {meta?.blurb ?? "Manual transfer"}
                </span>
                {selected && (
                  <span className="block text-xs font-semibold text-mango-orange mt-1.5">
                    View account details →
                  </span>
                )}
              </span>
            </button>
          );
        })}

        {accounts !== null && available.length === 0 && (
          <p className="text-xs text-ink-light">
            Bank, Easypaisa and JazzCash transfers aren&apos;t set up yet — Cash on Delivery is
            available for now.
          </p>
        )}
      </div>

      {value !== "cod" && (
        <p className="text-xs text-ink-light mt-3">
          After placing your order you&apos;ll be asked to upload your payment screenshot, and
          we&apos;ll confirm the order once we&apos;ve verified it.
        </p>
      )}

      {openAccount && (
        <PaymentDetailsDialog
          account={openAccount}
          total={total}
          onClose={() => setOpenAccount(null)}
        />
      )}
    </>
  );
}

function PaymentDetailsDialog({
  account,
  total,
  onClose,
}: {
  account: PaymentAccount;
  total: number;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const rows = [
    { label: "Account Title", value: account.account_title },
    account.bank_name ? { label: "Bank", value: account.bank_name } : null,
    {
      label: account.method === "bank" ? "Account Number" : "Mobile Number",
      value: account.account_number,
    },
    account.iban ? { label: "IBAN", value: account.iban } : null,
  ].filter((r): r is { label: string; value: string } => r !== null);

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${account.label} payment details`}
      onClick={onClose}
    >
      <div
        className="bg-surface w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-brand-lg max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle sticky top-0 bg-surface">
          <h3 className="font-serif text-lg font-bold">{account.label}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close payment details"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-cream-warm"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="p-5">
          <div className="bg-cream-warm rounded-xl p-4 mb-4 text-center">
            <div className="text-xs text-ink-light">Amount to transfer</div>
            <div className="font-bold text-2xl text-mango-orange tabular-nums">
              {formatPKR(total)}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {rows.map((row) => (
              <CopyRow key={row.label} label={row.label} value={row.value} />
            ))}
          </div>

          {account.instructions && (
            <p className="text-xs text-ink-light mt-4 pt-4 border-t border-border-subtle">
              {account.instructions}
            </p>
          )}

          <div className="mt-4 rounded-xl bg-mango-orange/8 border border-mango-orange/25 p-3.5 text-xs">
            <strong className="block mb-1">After you transfer</strong>
            Place the order, then upload your payment screenshot on the order tracking page. We
            verify it manually and confirm your order — usually within a few hours.
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full mt-5 bg-mango-orange text-white font-semibold py-3 rounded-full transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked (insecure context / permission) -- the number is
      // still visible on screen to copy manually, so fail quietly.
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 border border-border-subtle rounded-xl px-4 py-3">
      <div className="min-w-0">
        <div className="text-[0.7rem] text-ink-light">{label}</div>
        <div className="font-semibold text-sm break-all tabular-nums">{value}</div>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy ${label}`}
        className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-cream-warm hover:bg-mango-orange/15 transition-colors"
      >
        {copied ? (
          <Check className="w-4 h-4 text-orchard-green" aria-hidden="true" />
        ) : (
          <Copy className="w-4 h-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
