"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const STORAGE_KEY = "od_pending_referral";

// Renders nothing -- just persists a ?ref= code from the URL to
// localStorage so it survives from a shared link, through browsing, to
// whenever the visitor eventually signs up or signs in. Never overwrites an
// already-stored code: first link clicked gets the credit, matching how
// referral attribution is expected to work.
export function ReferralCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (!ref) return;
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, ref.trim().toUpperCase());
      }
    } catch {
      // private browsing / storage disabled -- referral just won't stick, not fatal
    }
  }, [searchParams]);

  return null;
}
