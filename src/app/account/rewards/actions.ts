"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type CheckInState =
  | { error: string }
  | { success: true; points: number; streak: number }
  | undefined;

type CheckInResult = { success: boolean; message: string; points_awarded: number; streak: number };
type RedeemResult = { success: boolean; message: string; coupon_code: string | null };

export async function checkIn(): Promise<CheckInState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in." };

  const { data, error } = await supabase.rpc("claim_daily_checkin").single();
  if (error) return { error: "Something went wrong. Please try again." };
  const result = data as unknown as CheckInResult;
  if (!result.success) return { error: result.message };

  revalidatePath("/account/rewards");
  return { success: true, points: result.points_awarded, streak: result.streak };
}

export type RedeemState =
  | { error: string }
  | { success: true; couponCode: string }
  | undefined;

export async function redeem(tier: string): Promise<RedeemState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in." };

  const { data, error } = await supabase.rpc("redeem_mango_credits", { p_tier: tier }).single();
  if (error) return { error: "Something went wrong. Please try again." };
  const result = data as unknown as RedeemResult;
  if (!result.success) return { error: result.message };

  revalidatePath("/account/rewards");
  return { success: true, couponCode: result.coupon_code! };
}

export async function getReferralCode(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase.rpc("get_or_create_referral_code");
  if (error) return null;
  return data as string;
}

export async function linkReferral(code: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.rpc("link_referral", { p_code: code });
  revalidatePath("/account/rewards");
}
