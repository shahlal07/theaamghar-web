import "server-only";
import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getCurrentVendor, isPlatformHost } from "@/lib/tenant";

/**
 * Everything that must happen after a session exists, regardless of HOW the
 * customer signed in (Google OAuth code exchange, or email+password).
 *
 * Both paths need it, so it lives here rather than only inside
 * /auth/callback -- an email sign-in that skipped the vendor binding would
 * leave a customer whose profile isn't scoped to this store, which then
 * fails confusingly later at checkout instead of here at sign-in.
 */
export async function finishSignIn(
  supabase: SupabaseClient,
  origin: string,
  host: string | null,
  returnTo: string
): Promise<NextResponse> {
  if (!isPlatformHost(host)) {
    const vendor = await getCurrentVendor();
    const { error: scopeError } = await supabase.rpc("ensure_customer_vendor", { p_vendor_id: vendor.id });
    if (scopeError) {
      await supabase.auth.signOut();
      return NextResponse.redirect(`${origin}/login?error=account_belongs_to_another_store`);
    }
  }

  // Google OAuth never supplies a phone number, and email signup doesn't
  // ask for one either -- the store needs one on file for delivery, so gate
  // any not-yet-completed account through the one-time completion step
  // rather than asking again at every login.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("phone").eq("id", user.id).maybeSingle();
    if (!profile?.phone) {
      return NextResponse.redirect(`${origin}/complete-profile?returnTo=${encodeURIComponent(returnTo)}`);
    }
  }

  return NextResponse.redirect(`${origin}${returnTo}`);
}
