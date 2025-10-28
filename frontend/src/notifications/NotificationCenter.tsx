import { useNotifications } from "./NotificationProvider";

export default function NotificationCenter() {
    const {notices, markRead, clear, unread} = useNotifications();

    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 max-w-md">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Notifications {unread ? `(${unread})` : ""}</h3>
                <button className="text-sm underline" onClick={clear}>Clear all</button>
            </div>

            <ul className="space-y-2 max-h-80 overflow-auto">
                {notices.length === 0 && <li className="text-sm text-gray-400">No notifications yet.</li>}
                {notices.map(n => (
                    <li key={n.id}
                        className="rounded-xl border border-white/10 bg-white/5 p-3 flex items-start gap-3">
                            
                            <div className="text-xl">{n.kind === "success" ? "✔️" : n.kind === "error" ? "✖️" : n.kind === "warning" ? "⚠️" : "ℹ️"}</div>
                            <div className="flex-1">
                                <div className="textfont-medium">{n.title}</div>
                                {n.message && <div className="text-sm opacity-80">{n.message}</div>}
                                <div className="text-xs opacity-60 mt-1">{new Date(n.ts).toLocaleString()}</div>
                            </div>
                            {!n.read && (
                                <button className="text-xs underline opacity-80" onClick={() => markRead(n.id)}>
                                    Mark read
                                </button>
                            )}
                    </li>
                ))}
            </ul>
        </div>
    );

}