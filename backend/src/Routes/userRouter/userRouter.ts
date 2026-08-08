import express from "express";
import {
  addUser,
  getUserById,
  loginUser,
  removeUser,
} from "../../controllers/userRouterController/userRouterController.js";
import authenticateToken from "../../middleware/authMiddleware.js";

export const userRouter = express.Router();
userRouter.post("/login", loginUser);
userRouter.post("/addUser", addUser);
userRouter.delete("/removeUser", authenticateToken, removeUser);
userRouter.get("/getUser", authenticateToken, getUserById);
