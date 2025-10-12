import { createContext, useContext, useMemo, useState, useEffect} from "react";
import type { ReactNode } from "react";
import type {Notice} from "./notify";
import { toastify } from "./notify";
import { authHeaders } from "../utils/auth";

type Ctx = {
    notices: Notice[];
    unread: number;
    push: (n: Notice, showToast?: boolean) => void;
    markRead: (id:string) => void;
    clear: () => void;
};
type ProviderProps = {children: ReactNode};

const NotificationCtx = createContext<Ctx | null>(null);
const LS_KEY = "hh-notifications";

export function NotificationProvider({children}: ProviderProps){
    const [notices, setNotices] = useState<Notice[]>(() =>{
        try {return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch { return [];}
    });

    useEffect(() => {localStorage.setItem(LS_KEY, JSON.stringify(notices)); }, [notices]);

    const push: Ctx["push"] = (n, showToast = true) => {
        setNotices((prev) => [n, ...prev].slice(0, 100));
        if (showToast) toastify(n);
    };

    const markRead: Ctx["markRead"] = (id) => {
    setNotices(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
    fetch(`/api/notifications/me/${id}/read`, {
      method: "POST",
      headers: authHeaders(),
    }).catch(() => {});
  };

    const clear: Ctx["clear"] = () => setNotices([]);

    const value = useMemo(() => ({
        notices,
        unread: notices.filter(n => !n.read).length,
        push, markRead, clear
    }), [notices]);
  
    return <NotificationCtx.Provider value={value}>{children}</NotificationCtx.Provider>
}

export const useNotifications= () => {
    const ctx = useContext(NotificationCtx);
    if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
    return ctx;
};

