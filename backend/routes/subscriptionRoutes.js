import express from "express";
import {
  createSubscription,
  getUserSubscriptions,
  getMySubscriptions,
  updateSubscription,
  cancelSubscription,
  renewSubscription,
  changeSubscriptionPlan,
  getAllSubscriptions
} from "../controllers/subscriptionController.js";

import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// USER routes
router.post("/", requireAuth, createSubscription);             // subscribe
router.get("/user/:userId", requireAuth, getUserSubscriptions); // get user subscriptions
router.get("/me", requireAuth, getMySubscriptions);           // my subscriptions
router.put("/:id", requireAuth, updateSubscription);          // update subscription
router.delete("/:id", requireAuth, cancelSubscription);       // cancel
router.put("/:id/renew", requireAuth, renewSubscription);     // renew
router.put("/:id/change-plan", requireAuth, changeSubscriptionPlan); // change plan

// ADMIN routes
router.get("/", requireAuth, requireRole("admin"), getAllSubscriptions);

export default router;
