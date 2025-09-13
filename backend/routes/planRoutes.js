import express from "express";
import {
  createPlan,
  getAllPlans,
  getPlanById,
  getActivePlans,
  updatePlan,
  deletePlan
} from "../controllers/planController.js";

import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Admin routes
router.post("/", requireAuth, requireRole("admin"), createPlan);
router.get("/", requireAuth, requireRole("admin"), getAllPlans);
router.get("/:id", requireAuth, getPlanById);
router.put("/:id", requireAuth, requireRole("admin"), updatePlan);
router.delete("/:id", requireAuth, requireRole("admin"), deletePlan);

// User route
router.get("/active", requireAuth, getActivePlans);

export default router;
