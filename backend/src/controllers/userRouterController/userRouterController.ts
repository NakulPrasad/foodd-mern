import User, { userInterface } from "../../models/userModel.js";
import { Request, Response } from "express";
import authService from "../../services/authService.js";
import userService from "../../services/userService.js";
import { Types } from "mongoose";

const UserService = userService.getInstance();
const AuthService = authService.getInstance();

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id: Types.ObjectId | string | null =
      typeof req.query.id === "string" ? req.query.id : null;

    // log(id);
    if (!id) {
      return res.status(400).json({ message: "Invalid UserId" });
    }
    const user: userInterface | null = await UserService.getUserById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ message: "User Found", data: user });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Invalid Request", Error: error.message });
  }
};

export const addUser = async (req: Request, res: Response) => {
  try {
    const newUser = {
      id : req.body.id,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      location: req.body.location,
    };
    const existingUser: userInterface | null = await User.findOne({
      email: newUser.email,
    });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User Already Exists With Given Email" });
    }
    const response = await UserService.registerUser(newUser, res);

    return response;
  } catch (error: any) {
    return res.status(500).json({
      message: "Error Occured During User Registration",
      Error: error.message,
    });
  }
};

export const removeUser = async (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    const sucess = await UserService.deleteUserById(id);
    if (!sucess) {
      return res
        .status(500)
        .json({ message: "Failed to remove user with provided id" });
    }
    return res.status(200).json({ message: "Successfully removed the user" });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: "Remove User Failed.",
      Error: error.message,
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const user = {
      email: req.body.email,
      password: req.body.password,
    };

    const response = AuthService.login(user, req, res);

    return response;
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: "Login Failed, check username and password.",
      Error: error.message,
    });
  }
};
