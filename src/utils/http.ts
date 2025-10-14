export const API_BASE =
  import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:4000" : ""); 

export async function apiFetch(path: string, init: RequestInit = {}) { 
  const token = localStorage.getItem("token"); 
  const headers = new Headers(init.headers || {}); 
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json"); 
  if (token && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  return res;
}