import dotenv from "dotenv";
// Load development environment variables first, then default
dotenv.config({ path: ".env.development" });
dotenv.config();

import MongoStore from "connect-mongo";
import express from "express";
import session from "express-session";
import morgan from "morgan";
import { apiRouter } from "./routes/api.router.js";
import passport, { passportRoutes } from "./configs/passport.js";
import dbConfig from "./configs/db.js";
import corsMiddleware from "./middleware/cors.js";
import rateLimiter from "./middleware/rate-limiter.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

/**
 * Initialize MongoDB connection once at startup
 * (Cached across warm serverless/Lambda invocations)
 */
const db = new dbConfig();
db.connect().catch((err) => console.error("MongoDB connection failed:", err));

// Trust proxy settings in production for proper client IP rate limiting
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Global Middlewares
app.use(corsMiddleware);
app.use(express.json());
app.use(morgan("dev"));
app.use(rateLimiter);

/**
 * Configure Express Sessions backed by MongoDB Store
 */
const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  throw new Error("SESSION_SECRET env variable is required but not set.");
}

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 Hours
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_CONNECTION_URI,
      ttl: 1 * 24 * 60 * 60, // 24 Hours
    }),
  }),
);

// Initialize Passport Session Authentication
app.use(passport.initialize());
app.use(passport.session());

/**
 * Base status checking route
 */
// Health & Status check route
app.get("/", (req, res) => {
  res.send("FOOD-MERN BACKEND WORKING FINE");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "FOOD-MERN BACKEND ONLINE",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "development",
  });
});

// REST API V1 Routing Entry Point
app.use("/apiv1", apiRouter);

// Passport Authentication endpoints routing
passportRoutes(app);

// 404 Not Found Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler as any);

export default app;
