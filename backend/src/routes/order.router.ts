import express from "express";
import {
  addOrder,
  getMyOrders,
  orderTest,
} from "../controllers/order.controller.js";

import authenticateToken from "../middleware/jwtAuth.js";
export const orderRouter = express.Router();
orderRouter.use(authenticateToken);
orderRouter.get("/test", orderTest);
orderRouter.get("/getMyOrders", getMyOrders);
orderRouter.post("/addOrder", addOrder as any);
