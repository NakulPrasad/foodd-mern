import rateLimit from "express-rate-limit";
import app from "../index.js";

/**
 * @description limits the request to 100 per minute
 */
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", true); //for rate limiter in production
}

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

export default rateLimiter;
