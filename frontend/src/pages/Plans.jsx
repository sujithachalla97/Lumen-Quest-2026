import React, { useEffect, useState, useCallback, useRef } from "react";

// PlansPage.jsx
// Unified Plans page for users + admins.
// Fixes applied:
// - Always fetch public active plans on mount so "no plans" won't show when user is unauthenticated.
// - Only open login modal when an action requires auth (Buy / Archive / Toggle) rather than on mount.
// - Dev-fill button still available on localhost to inject a test token + admin user.

// ----------------- apiFetch helper -----------------
async function apiFetch(path, opts = {}) {
  const API = (typeof window !== "undefined" && window.__API_BASE__) ? window.__API_BASE__ : "http://localhost:5000";
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = new Headers(opts.headers || {});
  if (!headers.get("Accept")) headers.set("Accept", "application/json");
  if (!headers.get("Content-Type") && !(opts.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const url = `${API}${path}`;
  const res = await fetch(url, { ...opts, headers });
  const ct = res.headers.get("content-type") || "";

  if (!res.ok) {
    const body = ct.includes("application/json") ? await res.json().catch(() => null) : await res.text().catch(() => null);
    const bodySnippet = typeof body === "string" ? body.slice(0,1000) : JSON.stringify(body).slice(0,1000);
    throw new Error(`Request ${url} failed ${res.status} ${res.statusText}: ${bodySnippet}`);
  }

  if (ct.includes("application/json")) return res.json();
  return res.text();
}

// ----------------- LoginModal -----------------
function LoginModal({ open, onClose, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const API = (typeof window !== "undefined" && window.__API_BASE__) ? window.__API_BASE__ : "http://localhost:5000";
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user);
      onClose();
    } catch (e) {
      setErr(e.message || "Login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg w-96 p-6">
        <h3 className="text-lg font-semibold mb-3">Sign in</h3>
        {err && <div className="text-red-600 mb-2">{err}</div>}
        <form onSubmit={submit}>
          <input className="w-full mb-2 p-2 border rounded" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <input className="w-full mb-4 p-2 border rounded" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1 border rounded">Cancel</button>
            <button type="submit" disabled={loading} className="px-3 py-1 bg-blue-600 text-white rounded">{loading ? 'Signing...' : 'Sign in'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------- PlanFormModal (create/edit) -----------------
function PlanFormModal({ open, onClose, onSaved, initial = null }) {
  const [name, setName] = useState(initial?.name || "");
  const [price, setPrice] = useState(initial?.price ?? "");
  const [autoRenew, setAutoRenew] = useState(initial?.autoRenewalAllowed || false);
  const [status, setStatus] = useState(initial?.status || "Active");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (initial) {
      setName(initial.name || "");
      setPrice(initial.price ?? "");
      setAutoRenew(initial.autoRenewalAllowed || false);
      setStatus(initial.status || "Active");
    }
  }, [initial]);

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const payload = { name: name.trim(), price: Number(price), autoRenewalAllowed: !!autoRenew, status };
      if (initial?._id) await apiFetch(`/api/plans/${initial._id}`, { method: "PUT", body: JSON.stringify(payload) });
      else await apiFetch(`/api/plans`, { method: "POST", body: JSON.stringify(payload) });
      onSaved && onSaved();
      onClose();
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg w-96 p-6">
        <h3 className="text-lg font-semibold mb-3">{initial?._id ? 'Edit Plan' : 'Create Plan'}</h3>
        {err && <div className="text-red-600 mb-2">{err}</div>}
        <form onSubmit={submit}>
          <input className="w-full mb-2 p-2 border rounded" placeholder="Plan name" value={name} onChange={(e)=>setName(e.target.value)} />
          <input className="w-full mb-2 p-2 border rounded" placeholder="Price" type="number" value={price} onChange={(e)=>setPrice(e.target.value)} />
          <label className="flex items-center gap-2 mb-2">
            <input type="checkbox" checked={autoRenew} onChange={(e)=>setAutoRenew(e.target.checked)} />
            <span className="text-sm">Auto renew allowed</span>
          </label>
          <label className="block mb-3">
            <span className="text-sm">Status</span>
            <select className="w-full p-2 border rounded" value={status} onChange={(e)=>setStatus(e.target.value)}>
              <option>Active</option>
              <option>Inactive</option>
              <option>Archived</option>
            </select>
          </label>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1 border rounded">Cancel</button>
            <button type="submit" disabled={loading} className="px-3 py-1 bg-green-600 text-white rounded">{loading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------- Main PlansPage -----------------
export default function PlansPage() {
  const [user, setUser] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [loginOpen, setLoginOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const lastActionRef = useRef(null);

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const limit = 10;

  // read user and token from localStorage once
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const u = raw ? JSON.parse(raw) : null;
      setUser(u);

    } catch {
      setUser(null);
    }
  }, []);

  const refresh = useCallback(async (p = 1) => {
    setLoading(true); setError(null);
    try {
      // If user is admin, try to fetch admin listing (requires token). If token missing, fall back to public active plans.
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (user && user.role === "admin" && token) {
        const params = new URLSearchParams();
        params.set("page", p); params.set("limit", limit);
        if (q) params.set("q", q);
        if (statusFilter) params.set("status", statusFilter);
        const payload = await apiFetch(`/api/plans?${params.toString()}`);
        setPlans(payload.data || []);
        setPage(payload.meta?.page || p);
        setPages(payload.meta?.pages || 1);
      } else {
        // public / unauthenticated listing
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        const data = await apiFetch(`/api/plans/active?${params.toString()}`);
        setPlans(data || []);
      }
    } catch (e) {
      const msg = (e && e.message) ? e.message : String(e);
      // If auth is required and missing, show friendly message but still keep any public plans displayed
      if (msg.toLowerCase().includes("authentication")) {
        setError("Authentication required for admin features. Sign in to see all plans.");
      } else {
        setError(msg);
      }
    } finally { setLoading(false); }
  }, [user, q, statusFilter]);

  useEffect(() => { // always fetch public plans on mount (and re-fetch when query/user changes)
    refresh(1);
  }, [refresh]);

  const requireLoginAndRetry = (action) => {
    lastActionRef.current = action;
    setLoginOpen(true);
  };

  const onLogin = (u) => {
    // store user + token already saved by LoginModal
    setUser(u);
    if (lastActionRef.current) {
      lastActionRef.current().catch(()=>{});
      lastActionRef.current = null;
    }
    refresh(1);
  };

  // buy flow
  const handleBuy = async (planId) => {
    if (!localStorage.getItem("token")) return requireLoginAndRetry(() => handleBuy(planId));
    try {
      await apiFetch(`/api/subscriptions`, { method: "POST", body: JSON.stringify({ planId }) });
      alert("Subscription created");
      refresh(page);
    } catch (e) { alert(e.message); }
  };

  const archivePlan = async (id) => {
    if (!localStorage.getItem("token")) return requireLoginAndRetry(() => archivePlan(id));
    if (!confirm("Archive this plan?")) return;
    try {
      await apiFetch(`/api/plans/${id}`, { method: "DELETE" });
      refresh(page);
    } catch (e) { alert(e.message); }
  };

  const toggleAutoRenew = async (id, current) => {
    if (!localStorage.getItem("token")) return requireLoginAndRetry(() => toggleAutoRenew(id, current));
    try {
      await apiFetch(`/api/plans/${id}/auto-renew`, { method: "PATCH", body: JSON.stringify({ autoRenewalAllowed: !current }) });
      refresh(page);
    } catch (e) { alert(e.message); }
  };

  const openEdit = (plan) => { setEditing(plan); setFormOpen(true); };
  const openCreate = () => { setEditing(null); setFormOpen(true); };

  const goto = (p) => { if (p < 1 || p > pages) return; refresh(p); };

  // dev quick-fill - only show on localhost or 127.0.0.1
  const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
  const devFill = () => {
    // WARNING: dev-only helper
    localStorage.setItem('token', 'DEV_TOKEN');
    localStorage.setItem('user', JSON.stringify({ name: 'Dev', role: 'admin' }));
    setUser({ name: 'Dev', role: 'admin' });
    setLoginOpen(false);
    refresh(1);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Plans</h2>

        <div className="flex items-center gap-3">
          <input placeholder="Search" value={q} onChange={(e)=>setQ(e.target.value)} className="p-2 border rounded" />

          {user?.role === "admin" && (
            <>
              <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)} className="p-2 border rounded">
                <option value="">All statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Archived">Archived</option>
              </select>
              <button onClick={openCreate} className="px-3 py-1 bg-green-600 text-white rounded">Create Plan</button>
            </>
          )}

          {!user && (
            <button onClick={()=>setLoginOpen(true)} className="px-3 py-1 border rounded">Sign in</button>
          )}

          {isLocal && (
            <button onClick={devFill} title="Dev: inject token + admin user" className="px-3 py-1 border rounded bg-yellow-200">Dev fill</button>
          )}
        </div>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}
      {loading && <div className="mb-4">Loading…</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.length === 0 && !loading && <div className="text-gray-600">No plans found.</div>}

        {plans.map(p => (
          <div key={p._id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <div className="text-sm text-gray-500">{p.status}</div>
              </div>
              <div className="text-2xl font-extrabold">₹{p.price}</div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="text-sm">
                {p.autoRenewalAllowed ? <span className="text-green-600">Auto-renew</span> : <span className="text-gray-600">Manual</span>}
              </div>

              <div className="flex gap-2">
                {user?.role !== "admin" && (
                  <button onClick={() => handleBuy(p._id)} className="px-3 py-1 bg-blue-600 text-white rounded">Buy</button>
                )}

                {user?.role === "admin" && (
                  <>
                    <button onClick={() => openEdit(p)} className="px-3 py-1 border rounded">Edit</button>
                    <button onClick={() => toggleAutoRenew(p._id, p.autoRenewalAllowed)} className="px-3 py-1 border rounded">Toggle Renew</button>
                    <button onClick={() => archivePlan(p._id)} className="px-3 py-1 bg-red-600 text-white rounded">Archive</button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {user?.role === "admin" && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button onClick={() => goto(page-1)} disabled={page<=1} className="px-3 py-1 border rounded">Prev</button>
          <div>Page {page} / {pages}</div>
          <button onClick={() => goto(page+1)} disabled={page>=pages} className="px-3 py-1 border rounded">Next</button>
        </div>
      )}

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} onLogin={onLogin} />
      <PlanFormModal open={formOpen} onClose={() => setFormOpen(false)} initial={editing} onSaved={() => refresh(page)} />
    </div>
  );
}
