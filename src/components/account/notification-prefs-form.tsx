"use client";

import { useState, useTransition } from "react";
import { updateNotificationPrefs } from "@/app/account/settings/actions";

const NOTIFICATION_PREFS = [
  { key: "harvestNews", label: "New harvest announcements", description: "When a fresh season starts" },
  { key: "priceAlerts", label: "Price drop & back-in-stock alerts", description: "For wishlisted items" },
  { key: "promotions", label: "Offers & coupons", description: "Occasional discount codes" },
] as const;

export function NotificationPrefsForm({
  initialPrefs,
}: {
  initialPrefs: Record<string, boolean>;
}) {
  const [prefs, setPrefs] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(NOTIFICATION_PREFS.map((p) => [p.key, initialPrefs[p.key] ?? true]))
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function toggle(key: string, checked: boolean) {
    const next = { ...prefs, [key]: checked };
    setPrefs(next); // optimistic -- reverted below if the save actually fails
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      for (const [k, v] of Object.entries(next)) fd.set(k, String(v));
      const result = await updateNotificationPrefs(undefined, fd);
      if (result && "error" in result) {
        setPrefs(prefs); // revert
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {NOTIFICATION_PREFS.map((pref) => (
        <label key={pref.key} className="flex items-center justify-between gap-4 cursor-pointer">
          <div>
            <div className="text-sm font-medium">{pref.label}</div>
            <div className="text-xs text-ink-light">{pref.description}</div>
          </div>
          <input
            type="checkbox"
            checked={prefs[pref.key]}
            onChange={(e) => toggle(pref.key, e.target.checked)}
            disabled={pending}
            className="w-5 h-5 accent-mango-orange"
          />
        </label>
      ))}
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
}
