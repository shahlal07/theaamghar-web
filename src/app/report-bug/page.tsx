import type { Metadata } from "next";
import { getBugReportsForCurrentUser, getMangoCreditsForCurrentUser } from "@/lib/queries/bug-reports";
import { getSiteContent } from "@/lib/queries/site-content";
import { ReportBugForm } from "@/components/report-bug-form";

export const metadata: Metadata = { title: "Report a Bug" };

export default async function ReportBugPage() {
  const [reports, mangoCredits, { loyaltyProgram }] = await Promise.all([
    getBugReportsForCurrentUser(),
    getMangoCreditsForCurrentUser(),
    getSiteContent(),
  ]);

  const statusMeta: Record<string, { label: string; className: string }> = {
    pending: { label: "Under review", className: "bg-cream-warm text-ink-light" },
    confirmed: {
      label: `Confirmed — +1 ${loyaltyProgram.emoji}`,
      className: "bg-orchard-green/15 text-orchard-green",
    },
    rejected: { label: "Not a bug", className: "bg-border-subtle text-ink-light" },
  };

  return (
    <div className="px-[5%] py-10 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl font-bold flex items-center gap-2">
          <span aria-hidden="true">🐞</span> Report a Bug
        </h1>
        <p className="text-sm text-ink-light mt-2">
          Found something broken on the site? Tell us about it. Every bug our team confirms earns
          you{" "}
          <strong className="text-ink">
            1 {loyaltyProgram.currencySingular} {loyaltyProgram.emoji}
          </strong>{" "}
          — reports are reviewed by hand before a credit is granted, not automatically.
        </p>
        {mangoCredits > 0 && (
          <div className="mt-3 inline-flex items-center gap-2 bg-golden/15 text-ink text-sm font-semibold rounded-full px-4 py-1.5">
            {loyaltyProgram.emoji} You have {mangoCredits}{" "}
            {mangoCredits === 1 ? loyaltyProgram.currencySingular : loyaltyProgram.currencyPlural}
          </div>
        )}
      </div>

      <ReportBugForm />

      {reports.length > 0 && (
        <div className="mt-10">
          <h2 className="font-serif text-lg font-bold mb-4">Your Reports</h2>
          <div className="flex flex-col gap-3">
            {reports.map((r) => {
              const meta = statusMeta[r.status] ?? statusMeta.pending;
              return (
                <div key={r.id} className="border border-border-subtle rounded-xl p-4 bg-surface">
                  <div className="flex items-start justify-between gap-3">
                    <div className="font-semibold text-sm">{r.title}</div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${meta.className}`}
                    >
                      {meta.label}
                    </span>
                  </div>
                  <p className="text-xs text-ink-light mt-1">
                    {new Date(r.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  {r.status === "rejected" && r.admin_note && (
                    <p className="text-xs text-ink-light mt-2 bg-cream-warm rounded-lg p-2.5">
                      {r.admin_note}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
