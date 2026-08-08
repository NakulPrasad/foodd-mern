import mongoose from "mongoose";
import CouponModel, { ICouponModel } from "../models/coupon.js";

export class CouponService {
  private static instance: CouponService;

  private constructor() {}

  public static getInstance(): CouponService {
    if (!CouponService.instance) {
      CouponService.instance = new CouponService();
    }
    return CouponService.instance;
  }

  /**
   * Default initial coupons for auto-seeding & standalone usage
   */
  private defaultCoupons = [
    {
      code: "FOODD50",
      title: "50% OFF up to ₹100",
      description: "Get 50% discount on food orders above ₹199",
      discountType: "percentage" as const,
      discountValue: 50,
      maxDiscount: 100,
      minOrderAmount: 199,
      validity: {
        startDate: new Date("2024-01-01"),
        endDate: new Date("2030-12-31"),
      },
      isActive: true,
    },
    {
      code: "FLAT100",
      title: "₹100 FLAT OFF",
      description: "Flat ₹100 discount on orders above ₹399",
      discountType: "flat" as const,
      discountValue: 100,
      maxDiscount: null,
      minOrderAmount: 399,
      validity: {
        startDate: new Date("2024-01-01"),
        endDate: new Date("2030-12-31"),
      },
      isActive: true,
    },
    {
      code: "WELCOME20",
      title: "20% OFF up to ₹60",
      description: "Get 20% discount on orders above ₹99",
      discountType: "percentage" as const,
      discountValue: 20,
      maxDiscount: 60,
      minOrderAmount: 99,
      validity: {
        startDate: new Date("2024-01-01"),
        endDate: new Date("2030-12-31"),
      },
      isActive: true,
    },
    {
      code: "FREEDEL30",
      title: "₹30 Delivery Waiver",
      description: "Enjoy ₹30 off delivery charge on orders above ₹150",
      discountType: "flat" as const,
      discountValue: 30,
      maxDiscount: null,
      minOrderAmount: 150,
      validity: {
        startDate: new Date("2024-01-01"),
        endDate: new Date("2030-12-31"),
      },
      isActive: true,
    },
  ];

  /**
   * Seed coupons if collection is empty
   */
  public async seedInitialCoupons(): Promise<void> {
    try {
      if (mongoose.connection.readyState === 1) {
        const count = await CouponModel.countDocuments();
        if (count === 0) {
          await CouponModel.insertMany(this.defaultCoupons);
          console.log("✅ Initial coupons seeded successfully");
        }
      }
    } catch (error) {
      console.error("Error seeding initial coupons:", error);
    }
  }

  /**
   * Get all active and valid coupons
   */
  public async getAvailableCoupons(): Promise<ICouponModel[]> {
    if (mongoose.connection.readyState === 1) {
      try {
        await this.seedInitialCoupons();
        const now = new Date();
        const coupons = await CouponModel.find({
          isActive: true,
          "validity.startDate": { $lte: now },
          "validity.endDate": { $gte: now },
        }).lean();

        if (coupons && coupons.length > 0) {
          return coupons as any;
        }
      } catch (err) {
        console.log("DB lookup error in getAvailableCoupons, using default coupons");
      }
    }
    return this.defaultCoupons as any;
  }

  /**
   * Validate coupon code and calculate discount amount
   */
  public async validateCoupon(
    code: string,
    itemTotal: number,
  ): Promise<{
    valid: boolean;
    message: string;
    discountAmount: number;
    coupon?: Partial<ICouponModel>;
  }> {
    if (!code || typeof code !== "string") {
      return { valid: false, message: "Coupon code is required", discountAmount: 0 };
    }

    const cleanCode = code.trim().toUpperCase();

    let coupon: any = null;
    if (mongoose.connection.readyState === 1) {
      try {
        coupon = await CouponModel.findOne({ code: cleanCode, isActive: true });
      } catch (e) {
        console.log("DB lookup error, checking default coupons");
      }
    }

    if (!coupon) {
      coupon = this.defaultCoupons.find((c) => c.code === cleanCode);
    }

    if (!coupon) {
      return { valid: false, message: `Coupon '${cleanCode}' is invalid or expired`, discountAmount: 0 };
    }

    const now = new Date();
    if (coupon.validity?.endDate && new Date(coupon.validity.endDate) < now) {
      return { valid: false, message: `Coupon '${cleanCode}' has expired`, discountAmount: 0 };
    }

    if (itemTotal < coupon.minOrderAmount) {
      return {
        valid: false,
        message: `Add items worth ₹${(coupon.minOrderAmount - itemTotal).toFixed(0)} more to apply '${cleanCode}' (Min ₹${coupon.minOrderAmount})`,
        discountAmount: 0,
      };
    }

    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = (itemTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && coupon.maxDiscount > 0) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscount);
      }
    } else if (coupon.discountType === "flat") {
      discountAmount = Math.min(coupon.discountValue, itemTotal);
    }

    discountAmount = Math.round(discountAmount * 100) / 100;

    return {
      valid: true,
      message: `Coupon '${cleanCode}' applied! Saved ₹${discountAmount}`,
      discountAmount,
      coupon: {
        code: coupon.code,
        title: coupon.title,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        maxDiscount: coupon.maxDiscount,
        minOrderAmount: coupon.minOrderAmount,
      },
    };
  }
}

export default CouponService;
