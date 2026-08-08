import jwt from "jsonwebtoken";
import authService from "../services/authService.js";
import express, { Response, Request, NextFunction } from "express";
const authenticateToken = express.Router();

authenticateToken.use((req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  //   console.log(authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
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
