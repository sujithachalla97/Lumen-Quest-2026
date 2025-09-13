import Discount from "../models/Discount.js";

// Get all discounts
export const getAllDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find();
    const result = discounts.map(discount => ({
      id: discount._id,
      code: discount.code,
      description: discount.description,
      percentage: discount.percentage,
      validFrom: discount.validFrom.toISOString(),
      validTo: discount.validTo.toISOString(),
      status: discount.status
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create discount
export const createDiscount = async (req, res) => {
  try {
    const discount = await Discount.create(req.body);
    res.status(201).json({ message: "Discount created successfully", discountId: discount._id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
