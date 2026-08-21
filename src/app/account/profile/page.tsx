import { createClient } from "@/lib/supabase/server";
import { getDashboardStats } from "@/lib/queries/dashboard-stats";
import { ProfileForm } from "@/components/account/profile-form";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: defaultAddress }, stats] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user!.id).single(),
    supabase
      .from("addresses")
      .select("label, address, city, province")
      .eq("profile_id", user!.id)
      .eq("is_default", true)
      .maybeSingle(),
    getDashboardStats(user!.id),
  ]);

  const initials =
    profile?.name
      ?.split(" ")
      .filter(Boolean)
      .map((w: string) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" })
    : "—";

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold mb-6">Profile</h1>

      <div className="grid md:grid-cols-[1fr_280px] gap-6">
        <div className="bg-surface border border-border-subtle rounded-brand p-6">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border-subtle">
            <div className="w-16 h-16 rounded-full bg-mango-orange text-white flex items-center justify-center font-bold text-xl shrink-0">
              {initials}
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl">{profile?.name || "Your profile"}</h2>
              <p className="text-sm text-ink-light">Member since {joinDate}</p>
            </div>
          </div>
          <ProfileForm profile={profile} defaultAddress={defaultAddress} />
        </div>

        <aside className="bg-surface border border-border-subtle rounded-brand p-5 h-fit">
          <h3 className="font-serif font-bold mb-4">Account Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between gap-3"><span className="text-ink-light">Orders</span><span className="font-semibold">{stats.totalOrders}</span></div>
            <div className="flex justify-between gap-3"><span className="text-ink-light">Total spent</span><span className="font-semibold">Rs. {Number(stats.totalSpent).toLocaleString()}</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
