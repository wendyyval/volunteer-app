export async function fetchProfile() {
  const res = await fetch("/api/profile");
  if (!res.ok) throw new Error("Failed to load profile");
  return res.json();
}
