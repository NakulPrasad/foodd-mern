import express from "express";
import {
  addUser,
  getUserById,
  loginUser,
  removeUser,
} from "../controllers/user.controller.js";
import authenticateToken from "../middleware/jwtAuth.js";

export const userRouter = express.Router();
userRouter.post("/login", loginUser);
userRouter.post("/addUser", addUser);
userRouter.delete("/removeUser", authenticateToken, removeUser);
userRouter.get("/getUser", authenticateToken, getUserById);
