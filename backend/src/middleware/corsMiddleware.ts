import cors from "cors";

/**
 * Permitted origins allowlist and regex matching.
 */
const ALLOWED_ORIGINS_PROD = [
  "https://foodd-mern.vercel.app",
  "https://foodd-mern-nakul011.vercel.app",
  "https://foodd-mern-backend.vercel.app",
];

const ALLOWED_ORIGINS_DEV = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
];

const corsMiddleware = cors({
  origin: function (origin, callback) {
    // Allow same-origin / non-browser requests (e.g. curl, Postman in dev)
    if (!origin) return callback(null, true);

    const isDev = process.env.NODE_ENV !== "production";

    if (isDev && (ALLOWED_ORIGINS_DEV.includes(origin) || origin.startsWith("http://localhost:"))) {
      return callback(null, true);
    }

    if (
      ALLOWED_ORIGINS_PROD.includes(origin) ||
      /^https:\/\/foodd-mern.*\.vercel\.app$/.test(origin)
    ) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
});

export default corsMiddleware;
