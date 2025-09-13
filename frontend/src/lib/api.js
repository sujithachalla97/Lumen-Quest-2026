// src/lib/api.js
import axios from "axios";

const base = import.meta.env.VITE_API_URL || "http://localhost:5000";
console.log("[DEBUG] API baseURL ->", base);

const api = axios.create({
  baseURL: "http://127.0.0.1:5000", // change to working host
  headers: { "Content-Type": "application/json" },
});

export default api;
