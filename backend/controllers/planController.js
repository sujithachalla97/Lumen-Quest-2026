import Plan from "../models/Plan.js";

/**
 * Admin: create plan
 */
export const createPlan = async (req, res) => {
  try {
    const plan = await Plan.create(req.body);
    return res.status(201).json(plan);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

/**
 * Admin: get all plans with pagination / filtering / search
 * Query params:
 *  q -> text search on name
 *  status -> Active|Inactive|Archived
 *  page, limit, sortBy, sortDir
 */
export const getAllPlans = async (req, res) => {
  try {
    const {
      q,
      status,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortDir = "desc",
      includeDeleted = "false"
    } = req.query;

    const filter = {};
    if (q) filter.$text = { $search: q };
    if (status) filter.status = status;
    if (includeDeleted !== "true") filter.isDeleted = false;

    const skip = (Math.max(parseInt(page, 10), 1) - 1) * parseInt(limit, 10);

    const [plans, total] = await Promise.all([
      Plan.find(filter)
        .sort({ [sortBy]: sortDir === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      Plan.countDocuments(filter)
    ]);

    return res.json({
      data: plans,
      meta: {
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * User: get only active plans (public)
 * Supports optional sort and q
 */
export const getActivePlans = async (req, res) => {
  try {
    const { q, sortBy = "price", sortDir = "asc", limit = 50 } = req.query;
    const filter = { status: "Active", isDeleted: false };
    if (q) filter.$text = { $search: q };

    const plans = await Plan.find(filter)
      .sort({ [sortBy]: sortDir === "asc" ? 1 : -1 })
      .limit(parseInt(limit, 10));

    return res.json(plans);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Admin: update plan
 */
export const updatePlan = async (req, res) => {
  try {
    const updates = req.body;
    // disallow isDeleted update from this endpoint to keep intent explicit
    delete updates.isDeleted;

    const plan = await Plan.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    return res.json(plan);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

/**
 * Admin: safe delete (soft-delete)
 * - Marks isDeleted = true and status = Archived
 * - Real delete could be a separate admin-only purge route
 */
export const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    // TODO: optionally check for active subscriptions referencing this plan and prevent deletion
    plan.isDeleted = true;
    plan.status = "Archived";
    await plan.save();

    return res.json({ message: "Plan archived (soft deleted)" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Admin: toggle autoRenewalAllowed
 */
export const toggleAutoRenew = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    plan.autoRenewalAllowed = !!req.body.autoRenewalAllowed;
    await plan.save();

    return res.json(plan);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

/**
 * Admin: hard purge (only for superadmin, not exposed by default)
 */
export const purgePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    return res.json({ message: "Plan permanently deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
