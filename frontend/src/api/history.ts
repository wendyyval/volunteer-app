import { apiFetch } from "../utils/http";
import { authHeaders } from "../utils/auth";
import type { HistoryItem } from "../types/event";

// Handle 401 Unauthorized responses
export function handle401(res: Response, redirect: () => void) {
  if (res.status === 401) {
    redirect();
    return true;
  }
  return false;
}

// Fetch the logged-in user's volunteer history
export async function fetchMyHistory() {
  return apiFetch("/api/history", {
    headers: authHeaders(),
  });
}

//Add a new history
export async function addMyHistory(item: Partial<HistoryItem>) {
  return apiFetch("/api/history", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(item),
  });
}

//Seed sample
export async function seedMyHistory() {
  return apiFetch("/api/history/seed", {
    method: "POST",
    headers: authHeaders(),
  });
}