import express from "express";
import {
  createSubscription,
  getMySubscriptions,
  cancelSubscription,
  renewSubscription,
  changeSubscriptionPlan,
  getAllSubscriptions
} from "../controllers/subscriptionController.js";

import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// USER routes
router.post("/", requireAuth, createSubscription);             // subscribe
router.get("/me", requireAuth, getMySubscriptions);           // my subscriptions
router.put("/:id/cancel", requireAuth, cancelSubscription);   // cancel
router.put("/:id/renew", requireAuth, renewSubscription);     // renew
router.put("/:id/change-plan", requireAuth, changeSubscriptionPlan); // change plan

// ADMIN routes
router.get("/", requireAuth, requireRole("admin"), getAllSubscriptions);

export default router;
