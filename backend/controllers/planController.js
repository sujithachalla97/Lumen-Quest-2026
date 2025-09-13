import Plan from "../models/Plan.js";

// Admin: create plan
export const createPlan = async (req, res) => {
  try {
    const plan = await Plan.create(req.body);
    res.status(201).json(plan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin: get all plans
export const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User: get only active plans
export const getActivePlans = async (req, res) => {
  try {
    const plans = await Plan.find({ status: "Active" });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: update plan
export const updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.json(plan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin: delete plan
export const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.json({ message: "Plan deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
