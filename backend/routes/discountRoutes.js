import express from "express";
import {
  createDiscount,
  getAllDiscounts,
  getDiscountById,
  updateDiscount,
  deleteDiscount,
  validateDiscount,
} from "../controllers/discountController.js";

import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// User endpoints
router.get("/", requireAuth, getAllDiscounts); // Users only see active discounts
router.get("/:id", requireAuth, getDiscountById); // Users only see active/valid discounts
router.post("/validate", requireAuth, validateDiscount); // Validate discount for a plan

// Admin endpoints
router.post("/", requireAuth, requireRole("admin"), createDiscount);
router.put("/:id", requireAuth, requireRole("admin"), updateDiscount);
router.delete("/:id", requireAuth, requireRole("admin"), deleteDiscount);

export default router;