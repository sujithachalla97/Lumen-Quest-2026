import Discount from "../models/Discount.js";
import Plan from "../models/Plan.js";

// Admin: Create discount
export const createDiscount = async (req, res) => {
  try {
    const { code, type, value, minAmount, maxDiscount, validFrom, validTo, usageLimit, applicablePlans, status, description } = req.body;
    
    // Validation
    if (!code || !type || !value || !validFrom || !validTo) {
      return res.status(400).json({ 
        message: "Code, type, value, validFrom, and validTo are required" 
      });
    }
    
    if (type === "percentage" && (value < 0 || value > 100)) {
      return res.status(400).json({ 
        message: "Percentage discount must be between 0 and 100" 
      });
    }
    
    if (new Date(validFrom) >= new Date(validTo)) {
      return res.status(400).json({ 
        message: "Valid from date must be before valid to date" 
      });
    }
    
    // Verify applicable plans exist
    if (applicablePlans && applicablePlans.length > 0) {
      const existingPlans = await Plan.find({ _id: { $in: applicablePlans } });
      if (existingPlans.length !== applicablePlans.length) {
        return res.status(400).json({ 
          message: "One or more specified plans do not exist" 
        });
      }
    }
    
    const discount = await Discount.create({
      code: code.toUpperCase(),
      type,
      value,
      minAmount: minAmount || 0,
      maxDiscount,
      validFrom: new Date(validFrom),
      validTo: new Date(validTo),
      usageLimit,
      applicablePlans: applicablePlans || [],
      status: status || "Active",
      description
    });
    
    const populatedDiscount = await Discount.findById(discount._id).populate('applicablePlans');
    res.status(201).json(populatedDiscount);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Discount code already exists" });
    }
    res.status(400).json({ message: error.message });
  }
};

// Admin/User: Get all discounts (users only see active ones)
export const getAllDiscounts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type } = req.query;
    const filter = {};
    
    // Users can only see active discounts
    if (req.user.role !== 'admin') {
      filter.status = 'Active';
      const now = new Date();
      filter.validFrom = { $lte: now };
      filter.validTo = { $gte: now };
    } else {
      // Admin can filter by status
      if (status) filter.status = status;
    }
    
    if (type) filter.type = type;
    
    const discounts = await Discount.find(filter)
      .populate('applicablePlans')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
      
    const total = await Discount.countDocuments(filter);
    
    res.json({
      discounts,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin/User: Get discount by ID
export const getDiscountById = async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id).populate('applicablePlans');
    
    if (!discount) {
      return res.status(404).json({ message: "Discount not found" });
    }
    
    // Users can only see active discounts that are currently valid
    if (req.user.role !== 'admin') {
      if (discount.status !== 'Active' || !discount.isCurrentlyValid) {
        return res.status(404).json({ message: "Discount not found" });
      }
    }
    
    res.json(discount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Update discount
export const updateDiscount = async (req, res) => {
  try {
    const { code, type, value, minAmount, maxDiscount, validFrom, validTo, usageLimit, applicablePlans, status, description } = req.body;
    
    const discount = await Discount.findById(req.params.id);
    if (!discount) {
      return res.status(404).json({ message: "Discount not found" });
    }
    
    // Validation for updated values
    if (type === "percentage" && value && (value < 0 || value > 100)) {
      return res.status(400).json({ 
        message: "Percentage discount must be between 0 and 100" 
      });
    }
    
    if (validFrom && validTo && new Date(validFrom) >= new Date(validTo)) {
      return res.status(400).json({ 
        message: "Valid from date must be before valid to date" 
      });
    }
    
    // Verify applicable plans exist
    if (applicablePlans && applicablePlans.length > 0) {
      const existingPlans = await Plan.find({ _id: { $in: applicablePlans } });
      if (existingPlans.length !== applicablePlans.length) {
        return res.status(400).json({ 
          message: "One or more specified plans do not exist" 
        });
      }
    }
    
    const updateData = {};
    if (code !== undefined) updateData.code = code.toUpperCase();
    if (type !== undefined) updateData.type = type;
    if (value !== undefined) updateData.value = value;
    if (minAmount !== undefined) updateData.minAmount = minAmount;
    if (maxDiscount !== undefined) updateData.maxDiscount = maxDiscount;
    if (validFrom !== undefined) updateData.validFrom = new Date(validFrom);
    if (validTo !== undefined) updateData.validTo = new Date(validTo);
    if (usageLimit !== undefined) updateData.usageLimit = usageLimit;
    if (applicablePlans !== undefined) updateData.applicablePlans = applicablePlans;
    if (status !== undefined) updateData.status = status;
    if (description !== undefined) updateData.description = description;
    
    const updatedDiscount = await Discount.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('applicablePlans');
    
    res.json(updatedDiscount);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Discount code already exists" });
    }
    res.status(400).json({ message: error.message });
  }
};

// Admin: Delete discount
export const deleteDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndDelete(req.params.id);
    if (!discount) {
      return res.status(404).json({ message: "Discount not found" });
    }
    res.json({ message: "Discount deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User: Validate discount for a plan
export const validateDiscount = async (req, res) => {
  try {
    const { code, planId, amount } = req.body;
    
    if (!code || !planId || !amount) {
      return res.status(400).json({ 
        message: "Code, planId, and amount are required" 
      });
    }
    
    // Find the discount
    const discount = await Discount.findOne({ 
      code: code.toUpperCase() 
    }).populate('applicablePlans');
    
    if (!discount) {
      return res.status(404).json({ 
        message: "Invalid discount code",
        isValid: false 
      });
    }
    
    // Check if discount is currently valid
    if (!discount.isCurrentlyValid) {
      let reason = "Discount code is not valid";
      if (discount.status !== 'Active') reason = "Discount code is inactive";
      else if (new Date() < discount.validFrom) reason = "Discount code is not yet active";
      else if (new Date() > discount.validTo) reason = "Discount code has expired";
      else if (discount.usageLimit && discount.usedCount >= discount.usageLimit) reason = "Discount usage limit reached";
      
      return res.status(400).json({ 
        message: reason,
        isValid: false 
      });
    }
    
    // Verify the plan exists
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ 
        message: "Plan not found",
        isValid: false 
      });
    }
    
    // Check if discount applies to this plan
    if (discount.applicablePlans.length > 0) {
      const planApplicable = discount.applicablePlans.some(
        applicablePlan => applicablePlan._id.toString() === planId.toString()
      );
      if (!planApplicable) {
        return res.status(400).json({ 
          message: "Discount code is not applicable to this plan",
          isValid: false 
        });
      }
    }
    
    // Check minimum amount
    if (amount < discount.minAmount) {
      return res.status(400).json({ 
        message: `Minimum order amount of ${discount.minAmount} required`,
        isValid: false 
      });
    }
    
    // Calculate discount
    const discountAmount = discount.calculateDiscount(amount);
    const finalAmount = amount - discountAmount;
    
    res.json({
      isValid: true,
      message: "Discount code is valid",
      discount: {
        code: discount.code,
        type: discount.type,
        value: discount.value,
        discountAmount,
        originalAmount: amount,
        finalAmount,
        savings: discountAmount
      }
    });
    
  } catch (error) {
    res.status(500).json({ 
      message: error.message,
      isValid: false 
    });
  }
};