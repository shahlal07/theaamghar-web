"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/safe-redirect";

export type SignupState = { error?: string; needsConfirmation?: boolean } | undefined;

export async function signup(_prevState: SignupState, formData: FormData): Promise<SignupState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const gender = String(formData.get("gender") ?? "").trim();
  const ageRaw = String(formData.get("age") ?? "").trim();
  const age = ageRaw ? Number(ageRaw) : null;
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const returnTo = safeRedirectPath(String(formData.get("returnTo") ?? ""));

  if (!name || !email || !password) {
    return { error: "Please fill in your name, email, and password." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords don't match." };
  }
  if (age !== null && (!Number.isInteger(age) || age < 13 || age > 120)) {
    return { error: "Please enter a valid age." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, phone, gender: gender || null, age } },
  });

  if (error) {
    // Match on Supabase's stable `code` field, not the free-text message --
    // verified against the real project via a direct /auth/v1/signup call
    // during development: `email_address_invalid` for domains GoTrue's
    // validator rejects (including RFC 2606 reserved ones like
    // example.com/.org -- worth knowing so a real "invalid domain" bug
    // report isn't mistaken for this), `over_email_send_rate_limit` when
    // retried too quickly, `user_already_exists` for a duplicate account.
    const messages: Record<string, string> = {
      user_already_exists: "An account with this email already exists.",
      email_address_invalid: "Please enter a valid email address.",
      over_email_send_rate_limit:
        "Too many attempts — please wait a minute before trying again.",
      weak_password: "Please choose a stronger password.",
    };
    return {
      error: messages[error.code ?? ""] ?? "Something went wrong creating your account. Please try again.",
    };
  }

  // If email confirmation is required by the project's auth settings,
  // there's no session yet -- data.session is null in that case and the
  // user needs to click the link sent to their inbox before returnTo can
  // be honored (via /auth/callback).
  if (!data.session) {
    return { needsConfirmation: true };
  }

  redirect(returnTo);
}
