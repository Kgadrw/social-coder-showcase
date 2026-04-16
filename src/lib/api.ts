const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:5174";

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    try {
      const parsed = JSON.parse(text) as { message?: string; error?: string };
      throw new Error(parsed.message || parsed.error || `Request failed (${res.status})`);
    } catch {
      throw new Error(text || `Request failed (${res.status})`);
    }
  }
  return (await res.json()) as T;
}

export async function login(password: string) {
  return apiFetch<{ ok: true }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}

export async function logout() {
  return apiFetch<{ ok: true }>("/api/auth/logout", { method: "POST" });
}

export async function getMe() {
  return apiFetch<{ isAdmin: boolean }>("/api/auth/me");
}

export async function uploadImage(file: File) {
  const form = new FormData();
  form.append("file", file);
  return apiFetch<{ url: string }>("/api/admin/upload", {
    method: "POST",
    body: form,
    headers: {}, // let browser set multipart boundary
  });
}

