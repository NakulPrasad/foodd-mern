import { Request, Response } from "express";
import CouponService from "../services/couponService.js";

const couponService = CouponService.getInstance();

export const getAvailableCoupons = async (req: Request, res: Response) => {
  try {
    const coupons = await couponService.getAvailableCoupons();
    return res.status(200).json({
      message: "Fetched available coupons",
      data: coupons,
    });
  } catch (error: any) {
    console.error("Error in getAvailableCoupons:", error);
    return res.status(500).json({ message: "Failed to fetch coupons" });
  }
};

export const validateCoupon = async (req: Request, res: Response) => {
  try {
    const { code, itemTotal } = req.body;

    if (!code) {
      return res.status(400).json({ valid: false, message: "Coupon code is required", discountAmount: 0 });
    }

    const subtotal = Number(itemTotal) || 0;
    const result = await couponService.validateCoupon(code, subtotal);

    if (!result.valid) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Error in validateCoupon:", error);
    return res.status(500).json({ valid: false, message: "Internal server error during coupon validation", discountAmount: 0 });
  }
};
