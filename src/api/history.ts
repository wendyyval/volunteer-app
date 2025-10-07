import { authHeaders, clearAuth } from "../utils/auth";


export type NewHistoryRow = {
    eventName?: string;
    eventDate?: string;
    location?: String;
    requiredSkills?: string[];
    urgency?: "Low" | "Medium" | "High";
    participationStatus?: "Registered" | "Confirmed" | "Attended" | "No-Show" | "Cancelled" | "Withdrawn";
    hours?: number;
};

export async function fetchMyHistory() {
  const res = await fetch("/api/history/me", { headers: authHeaders() });
  return res;
}

export async function addMyHistory(row: NewHistoryRow){
    const res = await fetch("/api/history/me", {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json"}),
        body: JSON.stringify(row),
    });
    return res;
}
export async function seedMyHistory() {
  const res = await fetch("/api/history/seed", {
    method: "POST",
    headers: authHeaders(),
  });
  return res;
}

export function handle401(res: Response, onUnauthorized: () => void) {
  if (res.status === 401) {
    clearAuth();
    onUnauthorized();
    return true;
  }
  return false;
}