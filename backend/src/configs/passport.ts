import dotenv from "dotenv";
dotenv.config({ path: ".env.development" });
dotenv.config();

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import authenticateToken from "../middleware/jwtAuth.js";
import authService from "../services/authService.js";
import userService from "../services/userService.js";
import { IGoogleOAuthLoginRequest } from "../types/auth.js";

const getGoogleClientId = () =>
  process.env.GOOGLE_CLIENTID || process.env.GOOGLE_CLIENT_ID || "";
const getGoogleClientSecret = () =>
  process.env.GOOGLE_CLIENTSECRET || process.env.GOOGLE_CLIENT_SECRET || "";
const getBackendUrl = () =>
  process.env.BACKEND_URL || process.env.BACKEND_URL_PROD || "http://localhost:3000";
const getFrontendUrl = () =>
  process.env.FRONTEND_URL || process.env.FRONTEND_URL_PROD || "http://localhost:5173";

const UserService = userService.getInstance();

// Always register GoogleStrategy so passport.authenticate("google") never throws "Unknown authentication strategy"
passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: getGoogleClientId() || "placeholder_client_id.apps.googleusercontent.com",
      clientSecret: getGoogleClientSecret() || "placeholder_client_secret",
      callbackURL: `${getBackendUrl()}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    },
  ),
);

// Serialize user into session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user, done) => {
  if (user) {
    return done(null, user);
  }
  return done(null, null);
});

const handleOAuthCallback = async (req: IGoogleOAuthLoginRequest, res: Response) => {
  const FRONTEND_URL = getFrontendUrl();
  try {
    if (!req.user) {
      return res.redirect(`${FRONTEND_URL}?error=oauth_failed`);
    }

    const userOAuth = {
      name: req.user.displayName || "Google User",
      email: req.user.emails?.[0]?.value || "",
      avatarUrl: req.user.photos?.[0]?.value || "",
      password: "dummy",
    };

    // Register or fetch user in MongoDB
    const dbUser = await UserService.registerUserOAuth(userOAuth);

    const payload = {
      id: dbUser?._id ? dbUser._id.toString() : req.user.id,
      name: dbUser?.name || userOAuth.name,
      email: dbUser?.email || userOAuth.email,
      avatarUrl: dbUser?.avatarUrl || userOAuth.avatarUrl,
    };

    const JWT_KEY = authService.getJWTKEY();
    if (!JWT_KEY) {
      console.error("JWTKEY is empty");
      return res.status(500).json({ message: "JWTKEY is empty" });
    }

    const authToken = jwt.sign(payload, JWT_KEY, { expiresIn: "24h" });

    return res.redirect(`${FRONTEND_URL}?token=${authToken}`);
  } catch (error) {
    console.error("Error handling Google OAuth callback:", error);
    return res.redirect(`${FRONTEND_URL}?error=oauth_exception`);
  }
};

export const passportRoutes = (app: any) => {
  // Login status check
  app.get(
    "/apiv1/auth/check",
    authenticateToken,
    (req: Request, res: Response) => {
      res.json({ ok: true, message: "authentication success", user: req.user });
    },
  );

  app.get("/apiv1/auth/profile", (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  });

  // Google OAuth Initiation middleware
  const initiateGoogleAuth = (req: Request, res: Response, next: NextFunction) => {
    const clientId = getGoogleClientId();
    const clientSecret = getGoogleClientSecret();

    if (!clientId || !clientSecret || clientId.includes("placeholder")) {
      console.warn("⚠️ Cannot initiate Google Auth: GOOGLE_CLIENTID / GOOGLE_CLIENTSECRET not configured.");
      return res.status(400).json({
        message: "Google OAuth credentials are not configured in backend environment variables.",
      });
    }

    passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
  };

  app.get("/apiv1/auth/google", initiateGoogleAuth);
  app.get("/auth/google", initiateGoogleAuth);

  // Google OAuth Callback middleware
  const handleGoogleCallbackMiddleware = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("google", {
      failureRedirect: `${getFrontendUrl()}?error=google_oauth_failed`,
    })(req, res, next);
  };

  app.get("/auth/google/callback", handleGoogleCallbackMiddleware, handleOAuthCallback);
  app.get("/apiv1/auth/google/callback", handleGoogleCallbackMiddleware, handleOAuthCallback);

  // Logout route
  app.get("/auth/logout", (req: Request, res: Response) => {
    req.logout(() => {
      res.redirect("/");
    });
  });
};

export default passport;
