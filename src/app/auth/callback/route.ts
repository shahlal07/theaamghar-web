import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/safe-redirect";
import { getCurrentVendor, isPlatformHost } from "@/lib/tenant";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const returnTo = safeRedirectPath(searchParams.get("returnTo"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
      if (!isPlatformHost(host)) {
        const vendor = await getCurrentVendor();
        const { error: scopeError } = await supabase.rpc("ensure_customer_vendor", { p_vendor_id: vendor.id });
        if (scopeError) {
          await supabase.auth.signOut();
          return NextResponse.redirect(`${origin}/login?error=account_belongs_to_another_store`);
        }
      }
      return NextResponse.redirect(`${origin}${returnTo}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
