// Subscriptions.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";

/**
 * Subscriptions.jsx
 * - User: view my subscriptions, cancel, renew, change plan
 * - Public: quick subscribe UI (expects token; will ask to login)
 * - Admin: view all subscriptions
 *
 * Usage:
 *  - Place file in components/pages folder and import where needed.
 *  - Expects login modal + apiFetch behavior from previous files. This file has its own apiFetch.
 *  - Ensure window.__API_BASE__ is set or backend at http://localhost:5000
 */

// small apiFetch helper (same semantics used earlier)
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

export default function SubscriptionsPage() {
  const [user, setUser] = useState(null);
  const [mySubs, setMySubs] = useState([]);
  const [allSubs, setAllSubs] = useState([]);
  const [plans, setPlans] = useState([]); // for change-plan select
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showLogin, setShowLogin] = useState(false); // your app can reuse existing LoginModal
  const lastActionRef = useRef(null);

  // pagination for admin
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const limit = 20;

  // hydrate user
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      setUser(raw ? JSON.parse(raw) : null);
    } catch {
      setUser(null);
    }
  }, []);

  // fetch public active plans (for switching plan)
  const fetchActivePlans = useCallback(async () => {
    try {
      const data = await apiFetch(`/api/plans/active`);
      setPlans(data);
    } catch (e) {
      // ignore - UI will show message
      console.error("Failed fetch plans:", e.message);
    }
  }, []);

  // fetch my subscriptions
  const fetchMySubs = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await apiFetch(`/api/subscriptions/me`);
      setMySubs(data);
    } catch (e) {
      const msg = e?.message || String(e);
      if (msg.toLowerCase().includes("authentication")) {
        setError("Sign in to see your subscriptions");
      } else setError(msg);
    } finally { setLoading(false); }
  }, []);

  // fetch all subscriptions (admin)
  const fetchAllSubs = useCallback(async (p = 1) => {
    setLoading(true); setError(null);
    try {
      const params = new URLSearchParams(); params.set("page", p); params.set("limit", limit);
      // backend route implemented as GET /api/subscriptions with admin guard
      const payload = await apiFetch(`/api/subscriptions?${params.toString()}`);
      // if your backend returns array instead of {data,meta}, adapt below
      if (Array.isArray(payload)) {
        setAllSubs(payload);
        setPage(1); setPages(1);
      } else {
        setAllSubs(payload.data || []);
        setPage(payload.meta?.page || p);
        setPages(payload.meta?.pages || 1);
      }
    } catch (e) {
      setError(e.message);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchActivePlans();
    // always try to show public things; mySubs requires token so call separately
    if (user) fetchMySubs();
    if (user?.role === "admin") fetchAllSubs(1);
  }, [user, fetchActivePlans, fetchMySubs, fetchAllSubs]);

  // helper: require login and retry
  const requireLoginAndRetry = (action) => {
    lastActionRef.current = action;
    setShowLogin(true);
  };
  const onLogin = (u) => {
    setUser(u);
    if (lastActionRef.current) {
      lastActionRef.current().catch(()=>{}); // attempt retry
      lastActionRef.current = null;
    }
    // refresh relevant lists
    fetchMySubs();
    if (u?.role === "admin") fetchAllSubs(1);
  };

  // create subscription (subscribe to plan)
  const subscribeToPlan = async (planId) => {
    if (!localStorage.getItem("token")) return requireLoginAndRetry(() => subscribeToPlan(planId));
    setLoading(true);
    try {
      const res = await apiFetch(`/api/subscriptions`, { method: "POST", body: JSON.stringify({ planId }) });
      // backend returns created subscription
      alert("Subscribed!");
      fetchMySubs();
    } catch (e) {
      alert(e.message);
    } finally { setLoading(false); }
  };

  // cancel
  const cancel = async (id) => {
    if (!localStorage.getItem("token")) return requireLoginAndRetry(() => cancel(id));
    if (!confirm("Cancel this subscription?")) return;
    try {
      await apiFetch(`/api/subscriptions/${id}/cancel`, { method: "PUT" });
      fetchMySubs();
    } catch (e) { alert(e.message); }
  };

  // renew
  const renew = async (id) => {
    if (!localStorage.getItem("token")) return requireLoginAndRetry(() => renew(id));
    try {
      await apiFetch(`/api/subscriptions/${id}/renew`, { method: "PUT" });
      fetchMySubs();
    } catch (e) { alert(e.message); }
  };

  // change plan
  const changePlan = async (id, newPlanId) => {
    if (!localStorage.getItem("token")) return requireLoginAndRetry(() => changePlan(id, newPlanId));
    try {
      await apiFetch(`/api/subscriptions/${id}/change-plan`, { method: "PUT", body: JSON.stringify({ newPlanId }) });
      fetchMySubs();
    } catch (e) { alert(e.message); }
  };

  // admin pagination controls
  const goto = (p) => { if (p < 1 || p > pages) return; fetchAllSubs(p); };

  // UI
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Subscriptions</h2>

      {/* Quick public subscribe — shows active plans to non-admins */}
      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Available plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.length === 0 && <div className="text-gray-600">No public plans.</div>}
          {plans.map(p => (
            <div key={p._id} className="border rounded p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-gray-500">{p.status}</div>
                </div>
                <div className="text-xl font-bold">₹{p.price}</div>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => subscribeToPlan(p._id)} className="px-3 py-1 bg-blue-600 text-white rounded">Subscribe</button>
                <button onClick={() => alert('Implement plan details modal as needed')} className="px-3 py-1 border rounded">Details</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* My subscriptions (requires login) */}
      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">My subscriptions</h3>
        {loading && <div>Loading…</div>}
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <div className="space-y-3">
          {mySubs.length === 0 && <div className="text-gray-600">You have no subscriptions.</div>}
          {mySubs.map(s => (
            <div key={s._id} className="border rounded p-3 flex justify-between items-center">
              <div>
                <div className="font-semibold">{s.plan?.name || "—"}</div>
                <div className="text-sm text-gray-500">Status: {s.status} • Ends: {s.endDate ? new Date(s.endDate).toLocaleDateString() : '—'}</div>
              </div>
              <div className="flex gap-2 items-center">
                {s.status !== "cancelled" && <button onClick={() => cancel(s._id)} className="px-2 py-1 border rounded">Cancel</button>}
                <button onClick={() => renew(s._id)} className="px-2 py-1 border rounded">Renew</button>

                {/* change plan select */}
                <select
                  onChange={(e) => { if (e.target.value) changePlan(s._id, e.target.value); }}
                  defaultValue=""
                  className="p-1 border rounded"
                >
                  <option value="">Change plan</option>
                  {plans.map(p => p._id !== s.plan?._id && <option key={p._id} value={p._id}>{p.name} — ₹{p.price}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Admin: all subscriptions */}
      {user?.role === "admin" && (
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">All subscriptions (admin)</h3>
          {allSubs.length === 0 && <div className="text-gray-600">No subscriptions found.</div>}
          <div className="space-y-2">
            {allSubs.map(s => (
              <div key={s._id} className="border rounded p-3 flex justify-between items-center">
                <div>
                  <div className="font-semibold">{s.plan?.name || '—'} <span className="text-sm text-gray-500">({s.plan?.status})</span></div>
                  <div className="text-sm text-gray-500">User: {s.user?.username || s.user?.email || '—'}</div>
                  <div className="text-sm text-gray-500">Status: {s.status} • {new Date(s.startDate).toLocaleDateString()} → {s.endDate ? new Date(s.endDate).toLocaleDateString() : '—'}</div>
                </div>
                <div className="text-sm text-gray-600">{s.autoRenew ? 'Auto-renew' : 'Manual'}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            <button onClick={() => goto(page-1)} disabled={page<=1} className="px-3 py-1 border rounded">Prev</button>
            <div>Page {page} / {pages}</div>
            <button onClick={() => goto(page+1)} disabled={page>=pages} className="px-3 py-1 border rounded">Next</button>
          </div>
        </section>
      )}

      {/* NOTE: replace with your app's LoginModal so onLogin triggers onLogin(user) */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded">
            <div className="mb-4">Please login to perform this action.</div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => { setShowLogin(false); }} className="px-3 py-1 border rounded">Close</button>
              <button onClick={() => {
                // dev fallback for tests (replace with real login flow)
                localStorage.setItem('token','DEV_TOKEN');
                localStorage.setItem('user', JSON.stringify({ name:'Dev', role:'user' }));
                const u = { name:'Dev', role:'user' };
                setShowLogin(false); onLogin(u);
              }} className="px-3 py-1 bg-blue-600 text-white rounded">Dev login</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
