import toast from "react-hot-toast"

export type NoticeKind = "success" | "info" | "warning" | "error";
export type NoticeTopic = "event_assignment" | "event_update" | "reminder" | "system";

export type Notice = {
    id: string;
    kind: NoticeKind;
    topic: NoticeTopic;
    title: string;
    message?: string;
    ts: number;
    read?: boolean;
};

const iconFor: Record<NoticeKind, string>={
    success: "✔️",
    info: "ℹ️",
    warning: "⚠️",
    error: "✖️",
};

export const toastify =(n: Notice) => {
    const text = `${iconFor[n.kind]} ${n.title}${n.message ? " = " + n.message : ""}`;
    switch (n.kind){
        case "success" : toast.success(text); break;
        case "info" : toast(text); break;
        case "warning" : toast(text, {icon : "⚠️"}); break;
        case "error" : toast.error(text); break;
    }
};

export const makeNotice = (p: Partial<Notice>& Pick<Notice, "kind" | "topic" | "title">): Notice => ({
    id: crypto.randomUUID(),
    message: "",
    ts: Date.now(),
    read: false,
    ...p,
});