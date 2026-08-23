"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import type { SiteContent } from "@/lib/queries/site-content";

// Real capture -- POSTs to /api/newsletter, which inserts into the
// newsletter_subscribers table (added alongside this section) rather than
// being a decorative form that goes nowhere.
export function Newsletter({ content }: { content: SiteContent["newsletter"] }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Section aria-label="Newsletter signup" className="bg-[var(--color-orchard-green)] text-white">
      <div className="max-w-xl mx-auto text-center">
        <Mail className="h-9 w-9 mx-auto mb-4 text-[var(--color-golden)]" strokeWidth={1.5} aria-hidden="true" />
        <Heading title={content.heading} light center />
        <p className="mt-4 text-white/85">{content.body}</p>

        {status === "done" ? (
          <p className="mt-8 font-semibold text-[var(--color-golden)]">{content.successMessage}</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 sm:max-w-xs rounded-full px-5 py-3.5 text-[var(--color-ink)] bg-white focus-visible:outline-none"
            />
            <Button type="submit" variant="primary" disabled={status === "loading"}>
              {status === "loading" ? "Subscribing…" : "Subscribe"}
            </Button>
          </form>
        )}
        {status === "error" && (
          <p className="mt-4 text-sm text-white/80">Something went wrong -- please try again.</p>
        )}
      </div>
    </Section>
  );
}
