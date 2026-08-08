import cors from "cors";

/**
 * Explicit allowlist of permitted origins.
 * Uses exact matching — no regex substring that could be fooled
 * by a domain like "evil-foodd-hack.com".
 */
const ALLOWED_ORIGINS_PROD = [
  "https://foodd-mern.vercel.app",
  "https://foodd-mern-backend.vercel.app",
];

const ALLOWED_ORIGINS_DEV = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
];

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ALLOWED_ORIGINS_PROD
    : ALLOWED_ORIGINS_DEV;

const corsMiddleware = cors({
  origin: function (origin, callback) {
    // Allow same-origin / non-browser requests (e.g. curl, Postman in dev)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(
      new Error(
        `CORS: Origin '${origin}' is not allowed. Permitted origins: ${allowedOrigins.join(", ")}`,
      ),
      false,
    );
  },
  credentials: true,
});

export default corsMiddleware;
