import Subscription from "../models/Subscription.js";
import Plan from "../models/Plan.js";

// Subscribe to a plan
export const createSubscription = async (req, res) => {
  try {
    const { userId, planId, autoRenew } = req.body;
    const plan = await Plan.findById(planId);
    if (!plan || plan.status !== "active") return res.status(404).json({ message: "Plan not available" });

    const subscription = new Subscription({
      user: userId,
      plan: planId,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      autoRenew: autoRenew || true
    });

    await subscription.save();
    res.status(201).json({ message: "Subscription created successfully", subscriptionId: subscription._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get user subscriptions
export const getUserSubscriptions = async (req, res) => {
  try {
    const subs = await Subscription.find({ user: req.params.userId }).populate("plan", "name");
    const result = subs.map(sub => ({
      id: sub._id,
      planId: sub.plan._id,
      planName: sub.plan.name,
      status: sub.status,
      startDate: sub.startDate.toISOString(),
      endDate: sub.endDate ? sub.endDate.toISOString() : null,
      autoRenew: sub.autoRenew
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get my subscriptions
export const getMySubscriptions = async (req, res) => {
  try {
    const subs = await Subscription.find({ user: req.user.id }).populate("plan", "name");
    const result = subs.map(sub => ({
      id: sub._id,
      planId: sub.plan._id,
      planName: sub.plan.name,
      status: sub.status,
      startDate: sub.startDate.toISOString(),
      endDate: sub.endDate ? sub.endDate.toISOString() : null,
      autoRenew: sub.autoRenew
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update subscription
export const updateSubscription = async (req, res) => {
  try {
    const { planId, autoRenew, status } = req.body;
    const sub = await Subscription.findById(req.params.id);
    if (!sub) return res.status(404).json({ message: "Subscription not found" });

    if (planId) {
      const plan = await Plan.findById(planId);
      if (!plan || plan.status !== "active") return res.status(404).json({ message: "Plan not available" });
      sub.plan = planId;
    }
    if (autoRenew !== undefined) sub.autoRenew = autoRenew;
    if (status) sub.status = status;

    await sub.save();
    res.json({ message: "Subscription updated successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Cancel subscription
export const cancelSubscription = async (req, res) => {
  try {
    const sub = await Subscription.findById(req.params.id);
    if (!sub) return res.status(404).json({ message: "Subscription not found" });

    sub.status = "cancelled";
    sub.autoRenew = false;
    await sub.save();
    res.json({ message: "Subscription cancelled successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Renew subscription
export const renewSubscription = async (req, res) => {
  try {
    const sub = await Subscription.findOne({ _id: req.params.id, user: req.user.id });
    if (!sub) return res.status(404).json({ message: "Subscription not found" });

    sub.status = "active";
    sub.startDate = new Date();
    sub.endDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
    sub.autoRenew = true;
    await sub.save();
    res.json({ message: "Subscription renewed", sub });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Change subscription plan
export const changeSubscriptionPlan = async (req, res) => {
  try {
    const { newPlanId } = req.body;
    const sub = await Subscription.findOne({ _id: req.params.id, user: req.user.id });
    if (!sub) return res.status(404).json({ message: "Subscription not found" });

    const newPlan = await Plan.findById(newPlanId);
    if (!newPlan || newPlan.status !== "active") return res.status(404).json({ message: "New plan not available" });

    sub.plan = newPlanId;
    sub.startDate = new Date();
    sub.endDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
    await sub.save();
    res.json({ message: "Subscription plan changed", sub });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: get all subscriptions
export const getAllSubscriptions = async (req, res) => {
  try {
    const subs = await Subscription.find()
      .populate("user", "name email")
      .populate("plan", "name price status");
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
