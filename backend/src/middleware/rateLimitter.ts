import rateLimit from "express-rate-limit";
/**
 * @description limits the request to 100 per minute
 */

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

export default rateLimiter;
