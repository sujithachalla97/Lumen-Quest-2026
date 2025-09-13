import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true,
    trim: true 
  },
  type: { 
    type: String, 
    enum: ["percentage", "fixed"], 
    required: true 
  },
  value: { 
    type: Number, 
    required: true,
    min: 0 
  },
  minAmount: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  maxDiscount: { 
    type: Number, 
    default: null 
  },
  validFrom: { 
    type: Date, 
    required: true 
  },
  validTo: { 
    type: Date, 
    required: true 
  },
  usageLimit: { 
    type: Number, 
    default: null 
  },
  usedCount: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  applicablePlans: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan"
  }],
  status: { 
    type: String, 
    enum: ["Active", "Inactive"], 
    default: "Active" 
  },
  description: {
    type: String,
    trim: true
  }
}, { 
  timestamps: true 
});

// Index for efficient queries
discountSchema.index({ code: 1 });
discountSchema.index({ status: 1, validFrom: 1, validTo: 1 });

// Virtual to check if discount is currently valid
discountSchema.virtual('isCurrentlyValid').get(function() {
  const now = new Date();
  return this.status === 'Active' && 
         this.validFrom <= now && 
         this.validTo >= now &&
         (this.usageLimit === null || this.usedCount < this.usageLimit);
});

// Method to calculate discount amount
discountSchema.methods.calculateDiscount = function(amount) {
  if (!this.isCurrentlyValid) return 0;
  if (amount < this.minAmount) return 0;
  
  let discount = 0;
  if (this.type === 'percentage') {
    discount = (amount * this.value) / 100;
    if (this.maxDiscount && discount > this.maxDiscount) {
      discount = this.maxDiscount;
    }
  } else if (this.type === 'fixed') {
    discount = this.value;
    if (discount > amount) discount = amount;
  }
  
  return discount;
};

const Discount = mongoose.model("Discount", discountSchema);

export default Discount;