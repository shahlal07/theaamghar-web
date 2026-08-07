import { createClient } from "@/lib/supabase/server";
import { getNotificationsForCurrentUser } from "@/lib/queries/notifications";
import { NotificationList } from "@/components/account/notification-list";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const notifications = await getNotificationsForCurrentUser();

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold mb-6">Notifications</h1>
      <NotificationList initialNotifications={notifications} userId={user!.id} />
    </div>
  );
}
