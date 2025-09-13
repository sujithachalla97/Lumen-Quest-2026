import express from "express";
import {
  createPlan,
  getAllPlans,
  getActivePlans,
  updatePlan,
  deletePlan,
} from "../controllers/planController.js";

import { requireAuth } from "../middleware/auth.js"; // protects routes
// import { requireAdmin } from "../middleware/roleAuth.js"; // if you add role-based auth

const router = express.Router();

// User endpoint
router.get("/active", requireAuth, getActivePlans);

// Admin endpoints
router.post("/", requireAuth, createPlan);
router.get("/", requireAuth, getAllPlans);
router.put("/:id", requireAuth, updatePlan);
router.delete("/:id", requireAuth, deletePlan);

export default router;
