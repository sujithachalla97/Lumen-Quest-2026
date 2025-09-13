// src/services/admin.js
import axios from "axios";

const BASE_URL = "http://localhost:5000"; // 🔹 Change to your backend URL

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

const Admin = {
    plans: {
        getAllPlans: async () => {
            const res = await api.get("/api/plans");
            return res.data;
        },
        getPlanById: async (id) => {
            const res = await api.get(`/api/plans/${id}`);
            return res.data;
        },
        createPlan: async (payload) => {
            const res = await api.post("/api/plans", payload);
            return res.data;
        },
        updatePlan: async (id, payload) => {
            const res = await api.put(`/api/plans/${id}`, payload);
            return res.data;
        },
        deletePlan: async (id) => {
            const res = await api.delete(`/api/plans/${id}`);
            return res.data;
        },
    },

    subscriptions: {
        getUserSubscriptions: async (userId) => {
            const res = await api.get(`/api/subscriptions/user/${userId}`);
            return res.data;
        },
        createSubscription: async (payload) => {
            const res = await api.post("/api/subscriptions", payload);
            return res.data;
        },
        updateSubscription: async (id, payload) => {
            const res = await api.put(`/api/subscriptions/${id}`, payload);
            return res.data;
        },
        cancelSubscription: async (id) => {
            const res = await api.delete(`/api/subscriptions/${id}`);
            return res.data;
        },
    },

    discounts: {
        getAllDiscounts: async () => {
            const res = await api.get("/api/discounts");
            return res.data;
        },
        createDiscount: async (payload) => {
            const res = await api.post("/api/discounts", payload);
            return res.data;
        },
    },

    analytics: {
        getTopPlans: async (period) => {
            const res = await api.get(`/api/analytics/top-plans?period=${period}`);
            return res.data;
        },
        getSubscriptionTrends: async () => {
            const res = await api.get("/api/analytics/trends");
            return res.data;
        },
        predictChurn: async () => {
            const res = await api.get("/api/analytics/churn");
            return res.data;
        },
    },

    logs: {
        getAuditLogs: async () => {
            const res = await api.get("/api/logs");
            return res.data;
        },
    },
};

export default Admin;
