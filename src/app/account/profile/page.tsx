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
      .map((w) => w[0])
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
              <div className="font-serif font-bold text-lg">{profile?.name ?? "Welcome"}</div>
              <div className="text-xs text-ink-light">Member since {joinDate}</div>
            </div>
          </div>
          <ProfileForm
            name={profile?.name ?? ""}
            email={profile?.email ?? user!.email ?? ""}
            phone={profile?.phone ?? ""}
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-surface border border-border-subtle rounded-brand p-5">
            <h2 className="text-sm font-bold mb-3">Default Address</h2>
            {defaultAddress ? (
              <p className="text-sm text-ink-light">
                <span className="font-semibold text-ink">{defaultAddress.label ?? defaultAddress.city}</span>
                <br />
                {defaultAddress.address}
                <br />
                {defaultAddress.city}
                {defaultAddress.province ? `, ${defaultAddress.province}` : ""}
              </p>
            ) : (
              <p className="text-sm text-ink-light">No default address set yet.</p>
            )}
          </div>

          <div className="bg-surface border border-border-subtle rounded-brand p-5">
            <h2 className="text-sm font-bold mb-1">Favourite Variety</h2>
            <p className="text-sm text-ink-light">
              {stats.favouriteVariety ?? "Order a few mangoes and we'll learn your favourite!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
