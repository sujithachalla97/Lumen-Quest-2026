import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Plan name required"],
    trim: true,
    maxlength: 100
  },
  price: {
    type: Number,
    required: [true, "Price required"],
    min: [0, "Price cannot be negative"]
  },
  autoRenewalAllowed: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ["Active", "Inactive", "Archived"],
    default: "Active"
  },
  // Soft delete
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Optional: add text index for searching by name
planSchema.index({ name: "text" });

const Plan = mongoose.models.Plan || mongoose.model("Plan", planSchema);
export default Plan;
