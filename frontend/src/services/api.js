// src/services/api.js
// Dummy API service (mock data now, replace with real axios calls later)

let dummyPlans = [
  {
    id: "p_basic",
    name: "Basic",
    price: 299,
    features: ["PhoneService", "OnlineBackup", "Month to Month"],
  },
  {
    id: "p_plus",
    name: "Plus",
    price: 499,
    features: [
      "PhoneService",
      "OnlineSecurity",
      "OnlineBackup",
      "StreamingTV",
      "One Year",
    ],
  },
  {
    id: "p_ultra",
    name: "Ultra",
    price: 799,
    features: [
      "PhoneService",
      "OnlineSecurity",
      "OnlineBackup",
      "DeviceProtection",
      "TechSupport",
      "StreamingTV",
      "StreamingMovies",
      "Two Year",
    ],
  },
];

let dummySubs = [];

export const api = {
  // ---------- PLANS ----------
  getPlans: async () => Promise.resolve(dummyPlans),

  createPlan: async (plan) => {
    dummyPlans.push(plan);
    return Promise.resolve(plan);
  },

  updatePlan: async (id, patch) => {
    const idx = dummyPlans.findIndex((p) => p.id === id);
    if (idx > -1) dummyPlans[idx] = { ...dummyPlans[idx], ...patch };
    return Promise.resolve(dummyPlans[idx]);
  },

  deletePlan: async (id) => {
    dummyPlans = dummyPlans.filter((p) => p.id !== id);
    return Promise.resolve(true);
  },

  // ---------- SUBSCRIPTIONS ----------
  getSubscriptionsByUser: async (userId) =>
    Promise.resolve(dummySubs.filter((s) => s.userId === userId)),

  subscribe: async ({ userId, planId }) => {
    // cancel any existing active subscription for this user
    dummySubs = dummySubs.map((s) =>
      s.userId === userId && s.status === "active"
        ? { ...s, status: "cancelled" }
        : s
    );

    // create new subscription
    const newSub = {
      id: `s_${Date.now()}`,
      userId,
      planId,
      status: "active",
      startedAt: new Date().toISOString(),
    };
    dummySubs.push(newSub);
    return Promise.resolve(newSub);
  },

  changePlan: async ({ subId, newPlanId }) => {
    const sub = dummySubs.find((s) => s.id === subId);
    if (sub && sub.status === "active") {
      sub.planId = newPlanId;
      return Promise.resolve(sub);
    }
    return Promise.reject("No active subscription found to change");
  },

  cancelSubscription: async (subId) => {
    dummySubs = dummySubs.map((s) =>
      s.id === subId && s.status === "active"
        ? { ...s, status: "cancelled" }
        : s
    );
    return Promise.resolve(dummySubs.find((s) => s.id === subId));
  },

  renewSubscription: async (subId) => {
    const sub = dummySubs.find((s) => s.id === subId);
    if (sub && sub.status === "cancelled") {
      // cancel other actives first (just in case)
      dummySubs = dummySubs.map((s) =>
        s.userId === sub.userId && s.status === "active"
          ? { ...s, status: "cancelled" }
          : s
      );
      sub.status = "active";
      sub.startedAt = new Date().toISOString();
      return Promise.resolve(sub);
    }
    return Promise.reject("Subscription not found or not cancelled");
  },

  // ---------- USERS ----------
  getUser: async (id) =>
    Promise.resolve({ id: "u_user", name: "Demo User", role: "user" }),

  listUsers: async () =>
    Promise.resolve([
      { id: "u_user", name: "Demo User", role: "user" },
      { id: "u_admin", name: "Admin", role: "admin" },
    ]),
};
