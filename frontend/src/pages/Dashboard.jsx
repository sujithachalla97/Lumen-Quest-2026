import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import PlansPage from "./Plans";
import SubscriptionsPage from "./Subscriptions";

/**
 Dashboard (layout) — renders PlansPage or SubscriptionsPage on the right
*/
export default function Dashboard() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tab, setTab] = useState("plans"); // "plans" | "subscriptions"

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white border-r z-30 transform md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} transition`}>
        <div className="h-full flex flex-col">
          <div className="px-6 py-5 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Billing Admin</h2>
            <div className="text-xs text-gray-500 mt-1">Plans & Subscriptions</div>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1">
            <button
              onClick={() => { setTab("plans"); setMobileOpen(false); }}
              className={`group w-full text-left px-4 py-2 rounded-lg ${tab === "plans" ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-50"}`}
            >
              Plans
            </button>

            <button
              onClick={() => { setTab("subscriptions"); setMobileOpen(false); }}
              className={`group w-full text-left px-4 py-2 rounded-lg ${tab === "subscriptions" ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-50"}`}
            >
              Subscriptions
            </button>
          </nav>

          <div className="p-4 border-t">
            <div className="text-xs text-gray-500 mb-2">Signed in as</div>
            <div className="text-sm font-medium text-gray-800">{user?.name ?? user?.email ?? "Guest"}</div>
            <div className="mt-3">
              <button
                onClick={logout}
                className="w-full inline-flex justify-center items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileOpen && <div className="fixed inset-0 bg-black/30 z-20 md:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Main area */}
      <div className="flex-1 md:pl-64 flex flex-col">
        {/* Header */}
        <header className="w-full bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
              <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 rounded-md bg-gray-100">☰</button>
              <div>
                <div className="text-lg font-semibold">Dashboard</div>
                <div className="text-sm text-gray-500">Manage billing plans & subscriptions</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-gray-500">Signed in as</div>
                <div className="font-medium text-gray-800">{user?.name ?? user?.email ?? "Guest"}</div>
              </div>
              <button onClick={logout} className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Content region */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Top tabs */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <button onClick={() => setTab("plans")} className={`px-4 py-2 rounded-lg ${tab === "plans" ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-700"}`}>Plans</button>
                <button onClick={() => setTab("subscriptions")} className={`px-4 py-2 rounded-lg ${tab === "subscriptions" ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-700"}`}>Subscriptions</button>
              </div>
              <div>
                <button className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">New</button>
              </div>
            </div>

            {/* Render selected page */}
            <div className="bg-white shadow rounded-lg p-4">
              {tab === "plans" && <PlansPage />}
              {tab === "subscriptions" && <SubscriptionsPage />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
