import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/safe-redirect";
import { finishSignIn } from "@/lib/auth-post-signin";

/**
 * Post-sign-in landing for the email+password path. The browser client has
 * already written the session cookies by the time we get here, so this just
 * runs the same vendor-binding / phone-completion steps the OAuth callback
 * does -- there's no `code` to exchange for this flow.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const returnTo = safeRedirectPath(searchParams.get("returnTo"));

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);

  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  return finishSignIn(supabase, origin, host, returnTo);
}
