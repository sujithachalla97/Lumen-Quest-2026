import Subscription from "../models/Subscription.js";
import Plan from "../models/Plan.js";

// Get top plans
export const getTopPlans = async (req, res) => {
  try {
    const { period } = req.query;
    let startDate;
    const now = new Date();

    if (period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1);
    } else {
      return res.status(400).json({ message: "Invalid period. Use 'month' or 'year'." });
    }

    const topPlans = await Subscription.aggregate([
      {
        $match: {
          startDate: { $gte: startDate },
          status: 'active'
        }
      },
      {
        $group: {
          _id: "$plan",
          subscriptions: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "plans",
          localField: "_id",
          foreignField: "_id",
          as: "plan"
        }
      },
      {
        $unwind: "$plan"
      },
      {
        $project: {
          planId: "$_id",
          planName: "$plan.name",
          subscriptions: 1
        }
      },
      {
        $sort: { subscriptions: -1 }
      }
    ]);

    res.json(topPlans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get subscription trends
export const getSubscriptionTrends = async (req, res) => {
  try {
    const trends = await Subscription.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$startDate" },
            month: { $month: "$startDate" }
          },
          activeSubscriptions: {
            $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] }
          },
          cancelledSubscriptions: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          month: {
            $concat: [
              { $toString: "$_id.year" },
              "-",
              { $cond: {
                if: { $lt: ["$_id.month", 10] },
                then: { $concat: ["0", { $toString: "$_id.month" }] },
                else: { $toString: "$_id.month" }
              }}
            ]
          },
          activeSubscriptions: 1,
          cancelledSubscriptions: 1
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    res.json(trends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Predict churn (simplified - based on autoRenew false)
export const predictChurn = async (req, res) => {
  try {
    const atRiskSubscriptions = await Subscription.find({ autoRenew: false, status: 'active' })
      .populate("user", "name")
      .limit(10); // Limit for demo

    const result = atRiskSubscriptions.map(sub => ({
      userId: sub.user._id,
      userName: sub.user.name,
      likelihoodToCancel: Math.floor(Math.random() * 100) // Placeholder for actual prediction
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
