import express from "express"
import { addUser, getMyDetails, getOrderDetails, loginUser } from "../../controllers/userRouterController/userRouterController.js"

export const userRouter = express.Router()
userRouter.post("/addUser", addUser);
userRouter.get("/my", getMyDetails);
userRouter.get("/getOrderData", getOrderDetails);
userRouter.post("/login",loginUser);