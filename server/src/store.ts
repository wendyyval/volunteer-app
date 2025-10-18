import { User, HistoryItem, AppNotification } from "./types";

// In-memory stores (no DB per assignment)
export const users: User[] = [
  { id: "u-1", email: "testing@gmail.com", name: "Test User", role: "volunteer" },
];

export const historyStore = new Map<string, HistoryItem[]>(); // userId -> items[]
export const noticeStore = new Map<string, AppNotification[]>(); // userId -> notices[]

export function getUserHistory(userId: string) {
  if (!historyStore.has(userId)) historyStore.set(userId, []);
  return historyStore.get(userId)!;
}

export function getUserNotices(userId: string) {
  if (!noticeStore.has(userId)) noticeStore.set(userId, []);
  return noticeStore.get(userId)!;
}
