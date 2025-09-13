// lib/apiFetch.js
export default async function apiFetch(path, opts = {}) {
  // base URL (adjust if you have env)
  const API = process.env.NEXT_PUBLIC_API_BASE || "";

  // grab token from localStorage (or replace with your auth store)
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = new Headers(opts.headers || {});
  headers.set("Accept", "application/json");
  headers.set("Content-Type", "application/json");

  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API}${path}`, { ...opts, headers });

  const contentType = res.headers.get("content-type") || "";

  // handle auth failure explicitly
  if (res.status === 401 || res.status === 403) {
    // optional: clear local session if token invalid
    // localStorage.removeItem("token");
    // localStorage.removeItem("user");
    const body = contentType.includes("application/json") ? await res.json().catch(()=>({})) : {};
    throw new Error(body.message || "Authentication required");
  }

  if (!res.ok) {
    if (contentType.includes("application/json")) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || JSON.stringify(err));
    }
    const txt = await res.text().catch(()=> "");
    throw new Error(`Request failed ${res.status}: ${txt.slice(0,240)}`);
  }

  if (contentType.includes("application/json")) return res.json();
  const text = await res.text();
  throw new Error("Expected JSON but got non-JSON: " + text.slice(0,240));
}
