import { authHeaders } from "../utils/auth";
import { useNotifications } from "./NotificationProvider";
import { apiFetch } from "../utils/http";
import toast from "react-hot-toast";
import type { Notice } from "./NotificationProvider";

type Options = { unreadOnly?: boolean; toast?: boolean };

export function useLoadNotices() {
  const { push } = useNotifications();

  return async function loadNotices({ unreadOnly = false }: Options = {}) {
    const path = unreadOnly
      ? "/notifications/me?unread=1"
      : "/notifications/me";

    try {
      const res = await apiFetch(path, { headers: authHeaders() });
      const data = await res.json().catch(() => []);

      data.forEach((n: Notice) => push(n, false));
      toast.success("Notifications updated");
    } catch (err) {
      console.error("Failed to load notifications", err);
      toast.error("Failed to load notifications");
    }
  };
}