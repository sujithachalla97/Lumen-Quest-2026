import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  autoRenewalAllowed: { type: Boolean, default: false },
  status: { type: String, enum: ["Active", "Inactive", "Archived"], default: "Active" },
}, { timestamps: true });

const Plan = mongoose.models.Plan || mongoose.model("Plan", planSchema);
export default Plan;
