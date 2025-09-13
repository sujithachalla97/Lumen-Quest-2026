import express from "express";
import {
  getTopPlans,
  getSubscriptionTrends,
  predictChurn
} from "../controllers/analyticsController.js";

import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Admin routes
router.get("/top-plans", requireAuth, requireRole("admin"), getTopPlans);
router.get("/trends", requireAuth, requireRole("admin"), getSubscriptionTrends);
router.get("/churn", requireAuth, requireRole("admin"), predictChurn);

export default router;
