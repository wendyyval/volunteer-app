import type { User, Event, HistoryItem, Notice } from "./types";

export const db = {
  users: [] as User[],
  events: [] as Event[],
  history: [] as HistoryItem[],
  notices: [] as Notice[]
};
