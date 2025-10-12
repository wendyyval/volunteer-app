import { authHeaders } from "../utils/auth";
import { makeNotice } from "./notify";
import { useNotifications } from "./NotificationProvider";

/** Hook that returns a function to load notices from the API and show them */
export function useLoadNotices() {
  const { push } = useNotifications();
  return async function loadNotices({ unreadOnly = false, toast = true } = {}) {
    const url = unreadOnly ? "/api/notifications/me?unread=1" : "/api/notifications/me";
    const res = await fetch(url, { headers: authHeaders() });
    const data = await res.json();
    (data as any[]).forEach(n => push(
      // ensure it fits our Notice shape if server returns plain objects
      makeNotice({ ...n, kind: n.kind, topic: n.topic, title: n.title, message: n.message }),
      toast
    ));
  };
}