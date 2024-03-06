import express from "express";
import { homeRouter } from "./Routes/homeRouter/homeRouter.js";
import { userRouter } from "./Routes/userRouter/userRouter.js";
import { orderRouter } from "./Routes/orderRouter/orderRouter.js";

export const apiRouter = express.Router();

apiRouter.use("/user",userRouter);
apiRouter.use("/home",homeRouter);
apiRouter.use("/order", orderRouter);
