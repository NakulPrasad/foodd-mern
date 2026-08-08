import jwt from "jsonwebtoken";
import authService from "../services/authService.js";
import express, { Response, Request, NextFunction } from "express";
import User from "../models/user.js";
const authenticateToken = express.Router();

authenticateToken.use(async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  //   console.log(authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];

  // Dev environment auto-login bypass
  if (process.env.NODE_ENV !== "production" && token === "mock-dev-token") {
    try {
      const dbUser = await User.findOne({ email: "nakulprasad10@gmail.com" });
      if (dbUser) {
        req.user = {
          id: dbUser._id.toString(),
          name: dbUser.name,
          email: dbUser.email,
          avatarUrl: dbUser.avatarUrl,
        };
      } else {
        req.user = {
          id: "66b4cb7df58d4a6f23e4ca1a",
          name: "Nakul Prasad Mahato",
          email: "nakulprasad10@gmail.com",
        };
      }
      return next();
    } catch (err) {
      req.user = {
        id: "66b4cb7df58d4a6f23e4ca1a",
        name: "Nakul Prasad Mahato",
        email: "nakulprasad10@gmail.com",
      };
      return next();
    }
  }

  try {
    const JWT_KEY = authService.getJWTKEY();
    if (!JWT_KEY) {
      console.error("JWTKEY is empty");
      return res.status(500).json({ message: "JWTKEY is empty" });
    }
    const decoded = jwt.verify(token, JWT_KEY);
    // log(decoded);
    /**
     * @description create a user property in request object
     */
    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ message: "Token expired" });
    } else {
      res.status(403).json({ message: "Invalid token" });
    }
  }
});

export default authenticateToken;
