import express from "express";
import {
  addOrder,
  getMyOrders,
  orderTest,
} from "../../controllers/orderRouterController/orderRouterController.js";

import authenticateToken from "../../middleware/authMiddleware.js";
export const orderRouter = express.Router();
orderRouter.use(authenticateToken);
orderRouter.get("/test", orderTest);
orderRouter.get("/getMyOrders", getMyOrders);
orderRouter.post("/addOrder", addOrder);
