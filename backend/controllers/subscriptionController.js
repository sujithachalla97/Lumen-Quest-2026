import Subscription from "../models/Subscription.js";
import Plan from "../models/Plan.js";

// Subscribe to a plan
export const createSubscription = async (req, res) => {
  try {
    const { planId } = req.body;
    const plan = await Plan.findById(planId);
    if (!plan || plan.status !== "Active") return res.status(404).json({ message: "Plan not available" });

    const subscription = new Subscription({
      user: req.user.id,
      plan: planId,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      autoRenew: plan.autoRenewalAllowed
    });

    await subscription.save();
    res.status(201).json(subscription);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get my subscriptions
export const getMySubscriptions = async (req, res) => {
  try {
    const subs = await Subscription.find({ user: req.user.id }).populate("plan", "name price status");
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cancel subscription
export const cancelSubscription = async (req, res) => {
  try {
    const sub = await Subscription.findOne({ _id: req.params.id, user: req.user.id });
    if (!sub) return res.status(404).json({ message: "Subscription not found" });

    sub.status = "cancelled";
    sub.autoRenew = false;
    await sub.save();
    res.json({ message: "Subscription cancelled", sub });
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
    if (!newPlan || newPlan.status !== "Active") return res.status(404).json({ message: "New plan not available" });

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
      .populate("user", "username email")
      .populate("plan", "name price status");
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
