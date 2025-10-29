import { apiFetch } from "../utils/http";
import { authHeaders } from "../utils/auth";
import type { HistoryItem } from "../types/event";
import { UserProfile } from '../types/user';

export async function fetchProfile(): Promise<UserProfile | null> {
  const userId = localStorage.getItem('userId');
  const response = await fetch(`/api/users/profile/${userId}`);
  if (!response.ok) return null;
  return response.json();
}

export function handle401(res: Response, redirect: () => void) {
  if (res.status === 401) {
    redirect();
    return true;
  }
  return false;
}


export async function fetchMyHistory() {
  return apiFetch("/api/history", {
    headers: authHeaders(),
  });
}


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

export async function seedMyHistory() {
  return apiFetch("/api/history/seed", {
    method: "POST",
    headers: authHeaders(),
  });
}