import express from "express";
import { body, param, query } from "express-validator";
import {
  createPlan,
  getAllPlans,
  getActivePlans,
  updatePlan,
  deletePlan,
  toggleAutoRenew,
  purgePlan
} from "../controllers/planController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import validate from "../middleware/validate.js"; // small middleware to handle express-validator results

const router = express.Router();

// Admin
router.post(
  "/",
  requireAuth,
  requireRole("admin"),
  body("name").isString().trim().notEmpty().withMessage("name required"),
  body("price").isFloat({ min: 0 }).withMessage("price must be >= 0"),
  validate,
  createPlan
);

router.get("/", requireAuth, requireRole("admin"), getAllPlans);

router.put(
  "/:id",
  requireAuth,
  requireRole("admin"),
  param("id").isMongoId(),
  body("price").optional().isFloat({ min: 0 }),
  validate,
  updatePlan
);

router.patch(
  "/:id/auto-renew",
  requireAuth,
  requireRole("admin"),
  param("id").isMongoId(),
  body("autoRenewalAllowed").isBoolean(),
  validate,
  toggleAutoRenew
);

router.delete("/:id", requireAuth, requireRole("admin"), param("id").isMongoId(), deletePlan);

// Purge (super-admin) - optional
router.delete("/:id/purge", requireAuth, requireRole("superadmin"), param("id").isMongoId(), purgePlan);

// Public / User
router.get("/active", requireAuth, getActivePlans);

export default router;
