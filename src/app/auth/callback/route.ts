import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/safe-redirect";
import { finishSignIn } from "@/lib/auth-post-signin";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const returnTo = safeRedirectPath(searchParams.get("returnTo"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
      return finishSignIn(supabase, origin, host, returnTo);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
