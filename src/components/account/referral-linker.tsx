"use client";

import { useEffect, useRef } from "react";
import { linkReferral } from "@/app/account/rewards/actions";

const STORAGE_KEY = "od_pending_referral";

// Mounted on every /account/* page. Runs once per session (per browser tab
// load) -- reads a referral code stashed by ReferralCapture, links it via
// the server action (which itself no-ops if this account already has a
// referrer or the code is invalid/self-referral), then clears local
// storage regardless of outcome so it doesn't keep retrying on every page.
export function ReferralLinker() {
  const attempted = useRef(false);

  useEffect(() => {
    if (attempted.current) return;
    attempted.current = true;

    let code: string | null = null;
    try {
      code = localStorage.getItem(STORAGE_KEY);
    } catch {
      return;
    }
    if (!code) return;

    linkReferral(code).finally(() => {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    });
  }, []);

  return null;
}
