export const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.DEV ? "http://localhost:3001/api" : "");

export async function apiFetch(path: string, init?: RequestInit) {
  const cleanPath = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const res = await fetch(cleanPath, init);
  return res;
}
