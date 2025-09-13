import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  autoRenewalAllowed: { type: Boolean, default: true },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
}, { timestamps: true });

const Plan = mongoose.model("Plan", planSchema);

export default Plan;
