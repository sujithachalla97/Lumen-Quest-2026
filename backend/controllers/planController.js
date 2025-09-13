import Plan from "../models/Plan.js";

// Admin: create plan
export const createPlan = async (req, res) => {
  try {
    const plan = await Plan.create(req.body);
    res.status(201).json({ message: "Plan created successfully", planId: plan._id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin: get all plans
export const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find().select('id name price quota status');
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get plan by ID
export const getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User: get only active plans
export const getActivePlans = async (req, res) => {
  try {
    const plans = await Plan.find({ status: "active" }).select('id name price quota status');
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
    res.json({ message: "Plan updated successfully" });
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
