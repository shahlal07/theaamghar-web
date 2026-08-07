"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Upload, Sparkles, CheckCircle2 } from "lucide-react";
import { useUser } from "@/lib/use-user";
import { submitBugReport, type SubmitBugReportState } from "@/app/report-bug/actions";

export function ReportBugForm() {
  const { user, loading } = useUser();
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [screenshotName, setScreenshotName] = useState<string | null>(null);
  const [state, formAction, pending] = useActionState<SubmitBugReportState, FormData>(
    async (_prev, formData) => submitBugReport(_prev, formData),
    undefined
  );

  if (loading) return null;

  if (!user) {
    return (
      <p className="text-sm text-ink-light border border-border-subtle rounded-2xl p-5 bg-surface">
        <Link
          href={`/login?returnTo=${encodeURIComponent("/report-bug")}`}
          className="text-mango-orange font-semibold"
        >
          Sign in
        </Link>{" "}
        to report a bug and earn mango credits.
      </p>
    );
  }

  function handleScreenshotChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (screenshotPreview) URL.revokeObjectURL(screenshotPreview);
    if (!file) {
      setScreenshotPreview(null);
      setScreenshotName(null);
      return;
    }
    setScreenshotPreview(URL.createObjectURL(file));
    setScreenshotName(file.name);
  }

  if (state && "success" in state) {
    return (
      <div className="border border-orchard-green/30 bg-orchard-green/8 rounded-2xl p-5">
        <div className="flex items-center gap-2.5 font-semibold text-orchard-green mb-3">
          <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
          Report submitted — thank you!
        </div>
        <div className="flex items-start gap-2.5 bg-surface border border-border-subtle rounded-xl p-4 text-sm">
          <Sparkles className="w-4 h-4 mt-0.5 shrink-0 text-mango-orange" aria-hidden="true" />
          <p>{state.aiReply}</p>
        </div>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 text-sm font-semibold text-mango-orange"
        >
          Report another bug →
        </button>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="border border-border-subtle rounded-2xl p-5 bg-surface flex flex-col gap-4"
    >
      <div>
        <label htmlFor="title" className="text-sm font-medium block mb-1">
          What went wrong?
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={150}
          placeholder="e.g. Checkout button doesn't respond on mobile"
          className="w-full border border-border-subtle rounded-brand-sm px-3 py-2.5 text-sm"
        />
      </div>

      <div>
        <label htmlFor="description" className="text-sm font-medium block mb-1">
          Describe it
        </label>
        <textarea
          id="description"
          name="description"
          required
          maxLength={3000}
          rows={5}
          placeholder="What were you doing, what did you expect to happen, and what actually happened?"
          className="w-full border border-border-subtle rounded-brand-sm px-3 py-2.5 text-sm"
        />
      </div>

      <div>
        <span className="text-sm font-medium block mb-1">Screenshot (optional)</span>
        <label
          htmlFor="screenshot"
          className="flex items-center justify-center gap-2 border-[1.5px] border-dashed border-border-subtle rounded-brand-sm px-4 py-5 text-sm cursor-pointer hover:border-mango-orange transition-colors"
        >
          <Upload className="w-4 h-4 text-mango-orange" aria-hidden="true" />
          {screenshotName ?? "Attach a screenshot"}
        </label>
        <input
          id="screenshot"
          name="screenshot"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleScreenshotChange}
          className="sr-only"
        />
        {screenshotPreview && (
          // eslint-disable-next-line @next/next/no-img-element -- transient client-side object URL
          <img
            src={screenshotPreview}
            alt=""
            className="mt-2 w-24 h-24 rounded-brand-sm object-cover border border-border-subtle"
          />
        )}
      </div>

      {state && "error" in state && <p className="text-sm text-error">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="bg-mango-orange text-white font-semibold px-6 py-3 rounded-full text-sm disabled:opacity-60 self-start"
      >
        {pending ? "Submitting…" : "Submit Bug Report"}
      </button>
    </form>
  );
}
