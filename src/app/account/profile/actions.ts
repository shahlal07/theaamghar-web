"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ProfileFormState = { error: string } | { success: true } | undefined;

const PK_PHONE_PATTERN = /^(?:\+92|0092|0)?3\d{2}[-\s]?\d{7}$/;

export async function updateProfile(
  _prev: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in." };

  const name = String(formData.get("name") ?? "").trim().slice(0, 80);
  const phone = String(formData.get("phone") ?? "").trim();

  if (!name) return { error: "Please enter your name." };
  if (phone && !PK_PHONE_PATTERN.test(phone)) {
    return { error: "Enter a valid Pakistani mobile number, e.g. 0300-1234567." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ name, phone: phone || null })
    .eq("id", user.id);

  if (error) return { error: "Something went wrong saving your profile. Please try again." };

  // Keep auth.users.raw_user_meta_data.name in sync too -- it's what
  // navbar's "Hi, {firstName}" reads via useUser()'s session data, since
  // that hook doesn't re-fetch the profiles row on every render.
  await supabase.auth.updateUser({ data: { name, phone } });

  revalidatePath("/account/profile");
  revalidatePath("/account");
  return { success: true };
}
