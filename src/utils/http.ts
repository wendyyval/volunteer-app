export const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "http://localhost:4000" : "");

export async function apiFetch(path: string, init?: RequestInit) {
  const url = `${API_BASE}${path}`;
  console.log("→ API CALL:", url);
  const res = await fetch(url, init);
  if (!res.ok){
    console.error("❌ API Error:", res.status, res.statusText);
  }
  return res;
}