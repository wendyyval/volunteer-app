

export function getToken() {
  return localStorage.getItem("token");
}

export function getUserId() {
  const user = localStorage.getItem("user");
  try {
    return user ? JSON.parse(user).id : null;
  } catch {
    return null;
  }
}

export function authHeaders(extra: Record<string, string> = {}) {
  const token = getToken();
  const userId = getUserId();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...extra,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (userId) {
    headers["x-user-id"] = String(userId);
  }

  return headers;
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
