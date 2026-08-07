"use client";

import { useState } from "react";
import Link from "next/link";
import { markNotificationRead, markAllNotificationsRead } from "@/lib/queries/notifications-client";
import { notificationIcon } from "@/lib/notification-icons";
import { EmptyState } from "@/components/account/empty-state";
import type { Tables } from "@/lib/supabase/types";

export function NotificationList({
  initialNotifications,
  userId,
}: {
  initialNotifications: Tables<"customer_notifications">[];
  userId: string;
}) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  async function handleMarkRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    await markNotificationRead(id);
  }

  async function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await markAllNotificationsRead(userId);
  }

  if (notifications.length === 0) {
    return (
      <EmptyState
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        }
        title="No notifications yet"
        message="Order updates, harvest announcements, and offers will show up here."
      />
    );
  }

  return (
    <div>
      {unreadCount > 0 && (
        <div className="flex justify-end mb-3">
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="text-xs font-semibold text-mango-orange"
          >
            Mark all as read
          </button>
        </div>
      )}
      <ul className="flex flex-col gap-2">
        {notifications.map((n) => {
          const content = (
            <div
              className={`flex items-start gap-3 p-4 rounded-2xl border-[1.5px] transition-colors ${
                n.read ? "border-border-subtle bg-surface" : "border-mango-orange/30 bg-mango-orange/5"
              }`}
            >
              <span className="text-xl shrink-0" aria-hidden="true">
                {notificationIcon(n.type)}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{n.title}</div>
                <div className="text-sm text-ink-light">{n.message}</div>
                <div className="text-xs text-ink-light mt-1">
                  {new Date(n.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              {!n.read && (
                <span className="w-2 h-2 rounded-full bg-mango-orange mt-1.5 shrink-0" aria-hidden="true" />
              )}
            </div>
          );

          return (
            <li key={n.id}>
              {n.link ? (
                <Link href={n.link} onClick={() => !n.read && handleMarkRead(n.id)}>
                  {content}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => !n.read && handleMarkRead(n.id)}
                  className="w-full text-left"
                >
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
