import express from "express";
import { getMyOrders, orderCheckout, orderTest } from "../../controllers/orderRouterController/orderRouterController.js";

export const orderRouter = express.Router();
orderRouter.post("/test",orderTest);
orderRouter.post("/getMyOrders", getMyOrders);
orderRouter.post("/orderCheckout", orderCheckout);