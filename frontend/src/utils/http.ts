export const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.DEV ? "http://localhost:4000/api" : "/api");

export async function apiFetch(path: string, init?: RequestInit) {
  const cleanPath = path.startsWith("http")
    ? path
    : `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;

  return fetch(cleanPath, init);
}