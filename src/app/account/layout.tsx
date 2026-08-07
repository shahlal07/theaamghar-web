import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUnreadNotificationCount } from "@/lib/queries/notifications";
import { AccountShell } from "@/components/account/account-shell";
import { ReferralLinker } from "@/components/account/referral-linker";

// Single auth guard + profile/notification fetch for every /account/* route
// -- individual pages no longer each redirect-if-unauthenticated themselves.
export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?returnTo=/account");

  const [{ data: profile }, unreadCount] = await Promise.all([
    supabase.from("profiles").select("name, email").eq("id", user.id).single(),
    getUnreadNotificationCount(),
  ]);

  return (
    <AccountShell profile={profile} unreadCount={unreadCount}>
      <ReferralLinker />
      {children}
    </AccountShell>
  );
}
