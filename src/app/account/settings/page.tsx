import { createClient } from "@/lib/supabase/server";
import { ChangePasswordForm } from "@/components/account/change-password-form";
import { NotificationPrefsForm } from "@/components/account/notification-prefs-form";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase.from("profiles").select("notification_prefs").eq("id", user.id).single()
    : { data: null };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl font-bold">Settings</h1>

      <section className="bg-surface border border-border-subtle rounded-brand p-6">
        <h2 className="font-serif text-lg font-bold mb-4">Change Password</h2>
        <ChangePasswordForm />
      </section>

      <section className="bg-surface border border-border-subtle rounded-brand p-6">
        <h2 className="font-serif text-lg font-bold mb-1">Notification Preferences</h2>
        <p className="text-sm text-ink-light mb-4">
          Order updates (shipped, delivered, cancelled) are always on. Choose what else you hear from us.
        </p>
        <NotificationPrefsForm
          initialPrefs={(profile?.notification_prefs as Record<string, boolean>) ?? {}}
        />
      </section>
    </div>
  );
}
