import { useEffect, useRef, useState } from "react";
import { useNotifications } from "./NotificationProvider";
import { useLoadNotices } from "./loadFromApi";

function timeAgo(ts: number) {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

export default function BellMenu() {
  const { notices, unread, markRead, clear } = useNotifications();
  const loadNotices = useLoadNotices();
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // close on click outside / ESC
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="notif-wrap" ref={boxRef}>
      <button
        className="notif-bell"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
      >
        <span className="bell" aria-hidden>🔔</span>
        {unread > 0 && <span className="notif-badge">{unread}</span>}
      </button>

      {open && (
        <div className="notif-panel" role="menu" aria-label="Notifications">
          <div className="notif-head">
            <strong>Notifications</strong>
            <div className="notif-actions">
              <button
                className="link-btn"
                onClick={() => loadNotices({ unreadOnly: true, toast: true })}
                title="Fetch unread from server"
              >
                Refresh
              </button>
              <button className="link-btn" onClick={() => clear()}>Clear</button>
            </div>
          </div>

          {notices.length === 0 ? (
            <div className="notif-empty">No notifications</div>
          ) : (
            <ul className="notif-list">
              {notices.slice(0, 8).map(n => (
                <li key={n.id} className={`notif-item ${n.read ? "is-read" : "is-unread"}`}>
                  <div className="notif-row">
                    <span className="notif-kind">{iconFor(n.kind)}</span>
                    <div className="notif-main">
                      <div className="notif-title">{n.title}</div>
                      {n.message && <div className="notif-msg">{n.message}</div>}
                      <div className="notif-meta">{n.topic} · {timeAgo(n.ts)} ago</div>
                    </div>
                  </div>
                  {!n.read && (
                    <button className="link-btn" onClick={() => markRead(n.id)}>
                      Mark read
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function iconFor(kind: "success" | "info" | "warning" | "error") {
  switch (kind) {
    case "success": return "✔️";
    case "warning": return "⚠️";
    case "error":   return "✖️";
    default:        return "ℹ️";
  }
}
