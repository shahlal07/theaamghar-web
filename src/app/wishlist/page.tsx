import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Wishlist now lives inside the account dashboard shell (sidebar nav item),
// so it always renders with the sidebar/notifications/etc. around it.
// This route stays only so existing links (navbar, footer, mobile tab bar)
// keep working without needing to be updated one by one.
export default async function WishlistRedirectPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  redirect(user ? "/account/wishlist" : "/login?returnTo=/account/wishlist");
}
