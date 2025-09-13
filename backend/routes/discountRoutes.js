import express from "express";
import {
  getAllDiscounts,
  createDiscount
} from "../controllers/discountController.js";

import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Admin routes
router.get("/", requireAuth, requireRole("admin"), getAllDiscounts);
router.post("/", requireAuth, requireRole("admin"), createDiscount);

export default router;
