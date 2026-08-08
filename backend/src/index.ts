import MongoStore from "connect-mongo";
import express from "express";
import session from "express-session";
import { createHandler } from "graphql-http/lib/use/express";
import morgan from "morgan";
import { apiRouter } from "./Routes/apiRouter.js";
import passport, { passportRoutes } from "./configs/passportConfig.js";
import root from "./graphql/resolvers.js";
import schema from "./graphql/schema.js";
import corsMiddleware from "./middleware/corsMiddleware.js";
import rateLimiter from "./middleware/rateLimitter.js";

const app = express();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1); // for rate limiter in production
}

app.use(corsMiddleware);
app.use(express.json());
app.use(morgan("dev"));
app.use(rateLimiter);

// Setup session
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
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_CONNECTION_URI,
      ttl: 1 * 24 * 60 * 60, // 24 hours
    }),
  }),
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

/**
 * Connect to database once at startup (see server.ts)
 */

// Create and use the GraphQL handler.
app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
  }),
);

/**
 * Routes
 */
app.get("/", (req, res) => {
  res.send("FOOD-MERN BACKEND WORKING FINE");
});

app.use("/apiv1", apiRouter);

passportRoutes(app);

// app.get("/graph", (_req, res) => {
//   res.type("html").end(ruruHTML({ endpoint: "/graphql" }))
// })

if (process.env.NODE_ENV !== "production") {
  import("ruru/server").then(({ ruruHTML }) => {
    app.get("/graphql", (_req, res) => {
      res.type("html").end(ruruHTML({ endpoint: "/graphql" }));
    });
  });
}

export default app;
