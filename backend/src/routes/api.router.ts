import express from "express";
import { foodRouter } from "./food.router.js";
import { homeRouter } from "./home.router.js";
import { orderRouter } from "./order.router.js";
import { userRouter } from "./user.router.js";
import { restaurantRouter } from "./restaurant.router.js";

export const apiRouter = express.Router();

apiRouter.use("/food", foodRouter);
apiRouter.use("/user", userRouter);
apiRouter.use("/home", homeRouter);
apiRouter.use("/order", orderRouter);
apiRouter.use("/restaurant", restaurantRouter);

