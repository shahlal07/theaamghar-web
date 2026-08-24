"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/safe-redirect";

export type CompleteProfileState = { error?: string } | undefined;

function normalizePhone(input: string): string | null {
  const cleaned = input.replace(/[\s-]/g, "");
  const match = cleaned.match(/^(?:\+92|0092|0)?(3\d{9})$/);
  return match ? `+92${match[1]}` : null;
}

export async function completeProfile(_prevState: CompleteProfileState, formData: FormData): Promise<CompleteProfileState> {
  const phone = normalizePhone(String(formData.get("phone") ?? ""));
  const returnTo = safeRedirectPath(String(formData.get("returnTo") ?? ""));

  if (!phone) {
    return { error: "Enter a valid Pakistani mobile number, e.g. 0300-1234567." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("profiles").update({ phone }).eq("id", user.id);
  if (error) {
    return { error: "Couldn't save your number. Please try again." };
  }

  redirect(returnTo);
}
