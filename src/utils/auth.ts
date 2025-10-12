export function getToken() {
  return localStorage.getItem("token");
}

export function authHeaders(extra: Record<string, string> = {}) {
  const t = getToken();
  return t ? { ...extra, Authorization: `Bearer ${t}` } : { ...extra };
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
}
