// src/services/api.js
const STORAGE_KEYS = {
  PLANS: "sms_plans_v1",
  SUBS: "sms_subs_v1",
  USERS: "sms_users_v1",
};

const wait = (ms = 400) => new Promise((res) => setTimeout(res, ms));

// initial seed if not present
function seed() {
  if (!localStorage.getItem(STORAGE_KEYS.PLANS)) {
    const plans = [
      {
        id: "p_basic",
        name: "Basic",
        price: 299,
        quotaGB: 100,
        features: ["100 GB data", "Standard support"],
      },
      {
        id: "p_plus",
        name: "Plus",
        price: 499,
        quotaGB: 300,
        features: ["300 GB data", "Priority support"],
      },
      {
        id: "p_ultra",
        name: "Ultra",
        price: 799,
        quotaGB: 1024,
        features: ["1 TB data", "24/7 support"],
      },
    ];
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SUBS)) {
    localStorage.setItem(STORAGE_KEYS.SUBS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const users = [
      { id: "u_user", name: "Demo User", role: "user" },
      { id: "u_admin", name: "Admin", role: "admin" },
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }
}

seed();

export const api = {
  getPlans: async () => {
    await wait();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PLANS) || "[]");
  },

  createPlan: async (plan) => {
    await wait();
    const plans = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLANS) || "[]");
    plans.push(plan);
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
    return plan;
  },

  updatePlan: async (id, patch) => {
    await wait();
    let plans = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLANS) || "[]");
    plans = plans.map((p) => (p.id === id ? { ...p, ...patch } : p));
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
    return plans.find((p) => p.id === id);
  },

  deletePlan: async (id) => {
    await wait();
    let plans = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLANS) || "[]");
    plans = plans.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
    return true;
  },

  // subscriptions
  getSubscriptionsByUser: async (userId) => {
    await wait();
    const subs = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBS) || "[]");
    return subs.filter((s) => s.userId === userId);
  },

  getAllSubscriptions: async () => {
    await wait();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBS) || "[]");
  },

  subscribe: async ({ userId, planId }) => {
    await wait(600);
    const subs = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBS) || "[]");
    // create a subscription record
    const id = `s_${Date.now()}`;
    const newSub = {
      id,
      userId,
      planId,
      status: "active",
      startedAt: new Date().toISOString(),
      autoRenew: true,
    };
    subs.push(newSub);
    localStorage.setItem(STORAGE_KEYS.SUBS, JSON.stringify(subs));
    return newSub;
  },

  changePlan: async ({ subId, newPlanId }) => {
    await wait(500);
    let subs = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBS) || "[]");
    subs = subs.map((s) =>
      s.id === subId
        ? { ...s, planId: newPlanId, changedAt: new Date().toISOString() }
        : s
    );
    localStorage.setItem(STORAGE_KEYS.SUBS, JSON.stringify(subs));
    return subs.find((s) => s.id === subId);
  },

  cancelSubscription: async (subId) => {
    await wait(300);
    let subs = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBS) || "[]");
    subs = subs.map((s) =>
      s.id === subId
        ? { ...s, status: "cancelled", cancelledAt: new Date().toISOString() }
        : s
    );
    localStorage.setItem(STORAGE_KEYS.SUBS, JSON.stringify(subs));
    return subs.find((s) => s.id === subId);
  },

  renewSubscription: async (subId) => {
    await wait(300);
    let subs = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBS) || "[]");
    subs = subs.map((s) =>
      s.id === subId
        ? { ...s, status: "active", renewedAt: new Date().toISOString() }
        : s
    );
    localStorage.setItem(STORAGE_KEYS.SUBS, JSON.stringify(subs));
    return subs.find((s) => s.id === subId);
  },

  // user helpers (mock login)
  getUser: async (id) => {
    await wait(200);
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]");
    return users.find((u) => u.id === id);
  },

  listUsers: async () => {
    await wait(200);
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]");
  },
};
