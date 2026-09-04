export interface MediaItem {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  createdAt: string;
  url: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { ...init, credentials: "include" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export function checkAuth(): Promise<{ authenticated: boolean }> {
  return request("/api/admin/me");
}

export function login(password: string): Promise<{ ok: true }> {
  return request("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
}

export function logout(): Promise<{ ok: true }> {
  return request("/api/admin/logout", { method: "POST" });
}

export function saveContent(key: string, value: unknown): Promise<{ ok: true }> {
  return request(`/api/admin/content/${key}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value),
  });
}

export function listMedia(): Promise<{ items: MediaItem[] }> {
  return request("/api/admin/media");
}

export async function uploadMedia(file: File): Promise<MediaItem> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/admin/media", { method: "POST", credentials: "include", body: form });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Upload failed (${res.status})`);
  }
  return res.json();
}

export function deleteMedia(id: string): Promise<{ ok: true }> {
  return request(`/api/admin/media/${id}`, { method: "DELETE" });
}
