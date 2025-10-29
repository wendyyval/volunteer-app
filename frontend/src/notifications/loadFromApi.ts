import { authHeaders } from "../utils/auth";
import { useNotifications } from "./NotificationProvider";
import { apiFetch } from "../utils/http";
import toast from "react-hot-toast";

type Options = { unreadOnly?: boolean; toast?: boolean };

export function useLoadNotices() {
  const { push } = useNotifications();

  return async function loadNotices({ unreadOnly = false, toast: showToast = true }: Options = {}) {
    const path = unreadOnly
      ? "/api/notifications/me?unread=1"
      : "/api/notifications/me";

    try {
      const res = await apiFetch(path, { headers: authHeaders() });
      const data = await res.json().catch(() => []);

      (data as any[]).forEach(n => {
        push(n);
        if (showToast) {
          toast.success(`${n.title}: ${n.message}`);
        }
      });
    } catch (err) {
      console.error("Failed to load notifications", err);
      toast.error("Failed to load notifications");
    }
  };
}