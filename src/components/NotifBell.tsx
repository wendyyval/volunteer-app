import { useNotifications } from "../notifications/NotificationProvider";
import { useLoadNotices } from "../notifications/loadFromApi";

export default function NotifBell() {
  const { unread } = useNotifications();
  const loadNotices = useLoadNotices();
  return (
    <button
      className="relative rounded-xl px-3 py-2 hover:bg-white/10"
      onClick={() => loadNotices({ unreadOnly: true, toast: true })}
      title="Check notifications"
    >
      🔔
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 text-xs bg-pink-500 text-white rounded-full px-1.5 py-0.5">
          {unread}
        </span>
      )}
    </button>
  );
}