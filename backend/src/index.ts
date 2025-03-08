import MongoStore from "connect-mongo";
import express from "express";
import session from "express-session";
import morgan from "morgan";
import { apiRouter } from "./Routes/apiRouter.js";
import dbConfig from "./configs/dbConfig2.js";
import passport, { passportRoutes } from "./configs/passportConfig.js";
import corsMiddleware from "./middleware/corsMiddleware.js";
import rateLimiter from "./middleware/rateLimitter.js";
import root from "./graphql/resolvers.js";
import schema from "./graphql/schema.js";
import  {createHandler} from "graphql-http/lib/use/express"
import {ruruHTML} from "ruru/server"

const app = express();

app.use(corsMiddleware);
app.use(express.json());
app.use(morgan("dev"));
app.use(rateLimiter);

// Setup session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret2024",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_CONNECTION_URI,
      ttl: 1 * 24 * 60 * 60, // 14 days
    }),
  }),
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

/**
 * Connect to database
 */
const dbconfig = new dbConfig();
dbconfig.connect();

// Create and use the GraphQL handler.
app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
  })
)

/**
 * Routes
 */
app.get("/", (req, res) => {
  res.send("FOOD-MERN BACKEND WORKING FINE");
});

app.use("/apiv1", apiRouter);

passportRoutes(app);

app.get("/graph", (_req, res) => {
  res.type("html")
  res.end(ruruHTML({ endpoint: "/graphql" }))
})

export default app;

