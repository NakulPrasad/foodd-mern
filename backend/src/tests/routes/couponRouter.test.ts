import { beforeAll, describe, expect, test, vi } from "vitest";
import { getAvailableCoupons, validateCoupon } from "../../controllers/coupon.controller.js";
import CouponService from "../../services/couponService.js";

const couponService = CouponService.getInstance();

describe("Backend Coupon Feature Test Suite", () => {
  beforeAll(() => {
    vi.stubEnv("NODE_ENV", "test");
  });

  describe("CouponService Unit Tests", () => {
    test("should validate percentage coupon FOODD50 (50% off up to 100 on order >= 199)", async () => {
      const result = await couponService.validateCoupon("FOODD50", 300);
      expect(result.valid).toBe(true);
      expect(result.discountAmount).toBe(100);
      expect(result.coupon?.code).toBe("FOODD50");
    });

    test("should calculate exact percentage discount without cap when under maxDiscount limit", async () => {
      const result = await couponService.validateCoupon("FOODD50", 199);
      expect(result.valid).toBe(true);
      expect(result.discountAmount).toBe(99.5);
    });

    test("should handle lowercase promo codes seamlessly", async () => {
      const result = await couponService.validateCoupon("foodd50", 250);
      expect(result.valid).toBe(true);
      expect(result.discountAmount).toBe(100);
    });

    test("should handle promo codes with leading/trailing whitespace", async () => {
      const result = await couponService.validateCoupon("  FLAT100   ", 500);
      expect(result.valid).toBe(true);
      expect(result.discountAmount).toBe(100);
    });

    test("should validate flat delivery discount FREEDEL30 (30 off on order >= 150)", async () => {
      const result = await couponService.validateCoupon("FREEDEL30", 200);
      expect(result.valid).toBe(true);
      expect(result.discountAmount).toBe(30);
    });

    test("should validate percentage coupon WELCOME20 (20% off up to 60 on order >= 99)", async () => {
      const result = await couponService.validateCoupon("WELCOME20", 200);
      expect(result.valid).toBe(true);
      expect(result.discountAmount).toBe(40); // 20% of 200 = 40
    });

    test("should reject coupon when order subtotal is below minimum order amount", async () => {
      const result = await couponService.validateCoupon("FOODD50", 150);
      expect(result.valid).toBe(false);
      expect(result.discountAmount).toBe(0);
      expect(result.message).toContain("Min ₹199");
    });

    test("should reject non-existent or invalid coupon code", async () => {
      const result = await couponService.validateCoupon("NOTREAL100", 500);
      expect(result.valid).toBe(false);
      expect(result.discountAmount).toBe(0);
      expect(result.message).toContain("invalid or expired");
    });

    test("should reject empty or missing coupon code", async () => {
      const result = await couponService.validateCoupon("", 500);
      expect(result.valid).toBe(false);
      expect(result.discountAmount).toBe(0);
      expect(result.message).toBe("Coupon code is required");
    });

    test("should return list of all active available coupons", async () => {
      const available = await couponService.getAvailableCoupons();
      expect(Array.isArray(available)).toBe(true);
      expect(available.length).toBeGreaterThanOrEqual(4);
      const codes = available.map((c: any) => c.code);
      expect(codes).toContain("FOODD50");
      expect(codes).toContain("FLAT100");
      expect(codes).toContain("WELCOME20");
      expect(codes).toContain("FREEDEL30");
    });
  });

  describe("Coupon Controller Handlers Tests", () => {
    test("getAvailableCoupons controller should return 200 with data array", async () => {
      let responseStatus = 0;
      let responseData: any = null;

      const req: any = {};
      const res: any = {
        status: (code: number) => {
          responseStatus = code;
          return {
            json: (data: any) => {
              responseData = data;
            },
          };
        },
      };

      await getAvailableCoupons(req, res);
      expect(responseStatus).toBe(200);
      expect(responseData.message).toBe("Fetched available coupons");
      expect(Array.isArray(responseData.data)).toBe(true);
    });

    test("validateCoupon controller should return 200 for valid coupon request", async () => {
      let responseStatus = 0;
      let responseData: any = null;

      const req: any = {
        body: {
          code: "FOODD50",
          itemTotal: 300,
        },
      };
      const res: any = {
        status: (code: number) => {
          responseStatus = code;
          return {
            json: (data: any) => {
              responseData = data;
            },
          };
        },
      };

      await validateCoupon(req, res);
      expect(responseStatus).toBe(200);
      expect(responseData.valid).toBe(true);
      expect(responseData.discountAmount).toBe(100);
    });

    test("validateCoupon controller should return 400 when promo code is missing", async () => {
      let responseStatus = 0;
      let responseData: any = null;

      const req: any = { body: {} };
      const res: any = {
        status: (code: number) => {
          responseStatus = code;
          return {
            json: (data: any) => {
              responseData = data;
            },
          };
        },
      };

      await validateCoupon(req, res);
      expect(responseStatus).toBe(400);
      expect(responseData.valid).toBe(false);
    });

    test("validateCoupon controller should return 400 when subtotal is below minimum", async () => {
      let responseStatus = 0;
      let responseData: any = null;

      const req: any = {
        body: {
          code: "FLAT100",
          itemTotal: 200,
        },
      };
      const res: any = {
        status: (code: number) => {
          responseStatus = code;
          return {
            json: (data: any) => {
              responseData = data;
            },
          };
        },
      };

      await validateCoupon(req, res);
      expect(responseStatus).toBe(400);
      expect(responseData.valid).toBe(false);
      expect(responseData.discountAmount).toBe(0);
    });
  });
});
