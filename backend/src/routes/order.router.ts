import express from "express";
import {
  addOrder,
  createCheckoutSession,
  getMyOrders,
  orderTest,
  verifyPayment,
} from "../controllers/order.controller.js";

import authenticateToken from "../middleware/jwtAuth.js";
export const orderRouter = express.Router();
orderRouter.use(authenticateToken);
orderRouter.get("/test", orderTest);
orderRouter.get("/getMyOrders", getMyOrders);
orderRouter.post("/addOrder", addOrder as any);

// Stripe Checkout routes
orderRouter.post("/create-checkout-session", createCheckoutSession as any);
orderRouter.post("/verify-payment", verifyPayment as any);
