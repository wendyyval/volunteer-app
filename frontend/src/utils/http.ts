export const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.DEV ? "http://localhost:3000" : "");

export async function apiFetch(path: string, init?: RequestInit) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, init);
  return res;
}