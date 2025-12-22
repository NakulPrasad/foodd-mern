import express from "express";
import { foodRouter } from "./foodRouter/foodRouter.js";
import { homeRouter } from "./homeRouter/homeRouter.js";
import { orderRouter } from "./orderRouter/orderRouter.js";
import { userRouter } from "./userRouter/userRouter.js";
import { restaurantRouter } from "./restaurantRouter/restaurantRouter.js";

export const apiRouter = express.Router();

apiRouter.use("/food", foodRouter);
apiRouter.use("/user", userRouter);
apiRouter.use("/home", homeRouter);
apiRouter.use("/order", orderRouter);
apiRouter.use("/restaurant", restaurantRouter);

