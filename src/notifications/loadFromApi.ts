import { authHeaders } from "../utils/auth";
import { makeNotice } from "./notify";
import { useNotifications } from "./NotificationProvider";
import { apiFetch } from "../utils/http";

type Options = { unreadOnly?: boolean; toast?: boolean };

export function useLoadNotices() {
  const { push } = useNotifications();

  return async function loadNotices({ unreadOnly = false, toast = true }: Options = {}) {
    const path = unreadOnly
      ? "/api/notifications/me?unread=1"
      : "/api/notifications/me";

    const res = await apiFetch(path, { headers: authHeaders() });
    const data = await res.json().catch();

    (data as any[]).forEach(n => {
      push(
        makeNotice({
          ...n,
          kind: n.kind,
          topic: n.topic,
          title: n.title,
          message: n.message,
        }),
        toast
      )
    });
  };
}