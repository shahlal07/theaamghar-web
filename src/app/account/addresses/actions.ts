"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AddressFormState = { error: string } | { success: true } | undefined;
const PK_PHONE_PATTERN = /^(?:\+92|0092|0)?3\d{2}[-\s]?\d{7}$/;

function readAddressForm(formData: FormData) {
  return {
    label: String(formData.get("label") ?? "").trim().slice(0, 40) || "Address",
    address: String(formData.get("address") ?? "").trim().slice(0, 200),
    city: String(formData.get("city") ?? "").trim().slice(0, 60),
    province: String(formData.get("province") ?? "").trim(),
    postalCode: String(formData.get("postalCode") ?? "").trim().slice(0, 10),
    phone: String(formData.get("phone") ?? "").trim(),
  };
}

function validate(form: ReturnType<typeof readAddressForm>): string | null {
  if (!form.address || !form.city || !form.province) return "Please fill in address, city, and province.";
  if (form.phone && !PK_PHONE_PATTERN.test(form.phone)) return "Enter a valid Pakistani mobile number, e.g. 0300-1234567.";
  return null;
}

export async function addAddress(_prev: AddressFormState, formData: FormData): Promise<AddressFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in." };
  const form = readAddressForm(formData);
  const validationError = validate(form);
  if (validationError) return { error: validationError };

  const { count } = await supabase.from("addresses").select("id", { count: "exact", head: true }).eq("profile_id", user.id);
  const { error } = await supabase.from("addresses").insert({
    profile_id: user.id,
    label: form.label,
    address_line1: form.address,
    city: form.city,
    province: form.province,
    postal_code: form.postalCode || null,
    phone: form.phone || null,
    country: "Pakistan",
    is_default: (count ?? 0) === 0,
  });
  if (error) return { error: "Something went wrong saving your address. Please try again." };
  revalidatePath("/account/addresses");
  return { success: true };
}

export async function updateAddress(addressId: string, _prev: AddressFormState, formData: FormData): Promise<AddressFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in." };
  const form = readAddressForm(formData);
  const validationError = validate(form);
  if (validationError) return { error: validationError };
  const { error } = await supabase.from("addresses").update({
    label: form.label,
    address_line1: form.address,
    city: form.city,
    province: form.province,
    postal_code: form.postalCode || null,
    phone: form.phone || null,
  }).eq("id", addressId).eq("profile_id", user.id);
  if (error) return { error: "Something went wrong saving your address. Please try again." };
  revalidatePath("/account/addresses");
  return { success: true };
}

export async function deleteAddress(addressId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { data: deleted } = await supabase.from("addresses").delete().eq("id", addressId).eq("profile_id", user.id).select("is_default").maybeSingle();
  if (deleted?.is_default) {
    const { data: nextAddress } = await supabase.from("addresses").select("id").eq("profile_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (nextAddress) await supabase.from("addresses").update({ is_default: true }).eq("id", nextAddress.id);
  }
  revalidatePath("/account/addresses");
}

export async function setDefaultAddress(addressId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("addresses").update({ is_default: false }).eq("profile_id", user.id);
  await supabase.from("addresses").update({ is_default: true }).eq("id", addressId).eq("profile_id", user.id);
  revalidatePath("/account/addresses");
}
