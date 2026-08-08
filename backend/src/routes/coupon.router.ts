import express from "express";
import { getAvailableCoupons, validateCoupon } from "../controllers/coupon.controller.js";

export const couponRouter = express.Router();

couponRouter.get("/available", getAvailableCoupons);
couponRouter.post("/validate", validateCoupon);
