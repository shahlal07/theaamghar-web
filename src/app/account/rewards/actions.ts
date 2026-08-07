"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type CheckInState =
  | { error: string }
  | { success: true; points: number; streak: number }
  | undefined;

export async function checkIn(): Promise<CheckInState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in." };

  const { data, error } = await supabase.rpc("claim_daily_checkin").single();
  if (error) return { error: "Something went wrong. Please try again." };
  if (!data.success) return { error: data.message };

  revalidatePath("/account/rewards");
  return { success: true, points: data.points_awarded, streak: data.streak };
}

export type RedeemState =
  | { error: string }
  | { success: true; couponCode: string }
  | undefined;

export async function redeem(tier: string): Promise<RedeemState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in." };

  const { data, error } = await supabase.rpc("redeem_mango_credits", { p_tier: tier }).single();
  if (error) return { error: "Something went wrong. Please try again." };
  if (!data.success) return { error: data.message };

  revalidatePath("/account/rewards");
  return { success: true, couponCode: data.coupon_code! };
}

export async function getReferralCode(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase.rpc("get_or_create_referral_code");
  if (error) return null;
  return data;
}

export async function linkReferral(code: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // Best-effort -- failure (already linked, invalid code, self-referral)
  // is silent by design here; the caller (ReferralLinker) just clears its
  // local storage either way and there's nothing useful to show the user
  // for an attribution link that didn't pan out.
  await supabase.rpc("link_referral", { p_code: code });
  revalidatePath("/account/rewards");
}
