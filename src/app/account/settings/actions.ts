"use server";

import { createClient } from "@/lib/supabase/server";

export type PasswordFormState = { error: string } | { success: true } | undefined;

export async function changePassword(
  _prev: PasswordFormState,
  formData: FormData
): Promise<PasswordFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in." };

  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (newPassword.length < 6) return { error: "Password must be at least 6 characters." };
  if (newPassword !== confirmPassword) return { error: "Passwords don't match." };

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { error: "Something went wrong changing your password. Please try again." };

  return { success: true };
}

export type NotificationPrefsState = { error: string } | { success: true } | undefined;

const PREF_KEYS = ["harvestNews", "priceAlerts", "promotions"] as const;

export async function updateNotificationPrefs(
  _prev: NotificationPrefsState,
  formData: FormData
): Promise<NotificationPrefsState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in." };

  const prefs = Object.fromEntries(PREF_KEYS.map((key) => [key, formData.get(key) === "true"]));

  const { error } = await supabase
    .from("profiles")
    .update({ notification_prefs: prefs })
    .eq("id", user.id);

  if (error) return { error: "Something went wrong saving your preferences. Please try again." };
  return { success: true };
}
