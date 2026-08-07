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
  if (!form.address || !form.city || !form.province) {
    return "Please fill in address, city, and province.";
  }
  if (form.phone && !PK_PHONE_PATTERN.test(form.phone)) {
    return "Enter a valid Pakistani mobile number, e.g. 0300-1234567.";
  }
  return null;
}

export async function addAddress(
  _prev: AddressFormState,
  formData: FormData
): Promise<AddressFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in." };

  const form = readAddressForm(formData);
  const validationError = validate(form);
  if (validationError) return { error: validationError };

  // First saved address becomes the default automatically -- otherwise a
  // freshly signed-up customer would have no default at all.
  const { count } = await supabase
    .from("addresses")
    .select("id", { count: "exact", head: true })
    .eq("profile_id", user.id);

  const { error } = await supabase.from("addresses").insert({
    profile_id: user.id,
    label: form.label,
    address: form.address,
    city: form.city,
    province: form.province,
    postal_code: form.postalCode || null,
    phone: form.phone || null,
    is_default: (count ?? 0) === 0,
  });

  if (error) return { error: "Something went wrong saving your address. Please try again." };

  revalidatePath("/account/addresses");
  return { success: true };
}

export async function updateAddress(
  addressId: string,
  _prev: AddressFormState,
  formData: FormData
): Promise<AddressFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in." };

  const form = readAddressForm(formData);
  const validationError = validate(form);
  if (validationError) return { error: validationError };

  // RLS ("users manage own addresses") already scopes this update to rows
  // this user owns -- the .eq("profile_id", user.id) is defense in depth,
  // not the only thing standing between this and editing someone else's row.
  const { error } = await supabase
    .from("addresses")
    .update({
      label: form.label,
      address: form.address,
      city: form.city,
      province: form.province,
      postal_code: form.postalCode || null,
      phone: form.phone || null,
    })
    .eq("id", addressId)
    .eq("profile_id", user.id);

  if (error) return { error: "Something went wrong saving your address. Please try again." };

  revalidatePath("/account/addresses");
  return { success: true };
}

export async function deleteAddress(addressId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: deleted } = await supabase
    .from("addresses")
    .delete()
    .eq("id", addressId)
    .eq("profile_id", user.id)
    .select("is_default")
    .maybeSingle();

  // If the default address was just deleted, promote the most recent
  // remaining one so there's always a default whenever any address exists.
  if (deleted?.is_default) {
    const { data: nextAddress } = await supabase
      .from("addresses")
      .select("id")
      .eq("profile_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (nextAddress) {
      await supabase.from("addresses").update({ is_default: true }).eq("id", nextAddress.id);
    }
  }

  revalidatePath("/account/addresses");
}

export async function setDefaultAddress(addressId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // Two statements, not a single-transaction RPC -- addresses.is_default has
  // no partial-unique-index enforcing "at most one default per profile", so
  // this is best-effort ordering (unset-all then set-one) rather than an
  // atomic guarantee. Acceptable here since it's user-initiated and rare.
  await supabase.from("addresses").update({ is_default: false }).eq("profile_id", user.id);
  await supabase
    .from("addresses")
    .update({ is_default: true })
    .eq("id", addressId)
    .eq("profile_id", user.id);

  revalidatePath("/account/addresses");
}
