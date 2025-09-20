import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import authenticateToken from "../middleware/authMiddleware.js";
import authService from "../services/authService.js";
import userService from "../services/userService.js";
import { GoogleOAuthLoginRequest } from "../types/auth.js";

const CLIENT_ID = process.env.GOOGLE_CLIENTID || "error";
const CLIENT_SEC = process.env.GOOGLE_CLIENTSECRET || "error";
const BACKEND_URL = process.env.BACKEND_URL || "error";
const FRONTEND_URL = process.env.FRONTEND_URL || "error";
const UserService = userService.getInstance();
const AuthService = authService.getInstance();

passport.use(
  new GoogleStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SEC,
      callbackURL: `${BACKEND_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      // Handle user information (e.g., save to DB)
      // console.log(profile); // Log the profile for reference

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

export const passportRoutes = (app: any) => {
  // Login route
  app.get(
    "/apiv1/auth/check",
    authenticateToken,
    (req: Request, res: Response) => {
      res.json({ ok: true, message: "authentication sucess", user: req.user });
    },
  );

  app.get("/apiv1/auth/profile", (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  });
  app.get(
    "/apiv1/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] }),
  );

  // Callback route
  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: FRONTEND_URL,
    }),
    async (req: GoogleOAuthLoginRequest, res: Response) => {
      const payload = {
        id: req.user.id, // Use a unique identifier from the user object
        name: req.user.displayName,
        email: req.user.emails[0].value,
        avatarUrl: req.user.photos[0].value,
      };

      const userOAuth = {
        name: req.user.displayName,
        email: req.user.emails[0].value,
        avatarUrl: req.user.photos[0].value,
        password: "dummy",
      };

      const options = { expiresIn: "24h" };

      const JWT_KEY = authService.getJWTKEY();
      if (!JWT_KEY) {
        console.error("JWTKEY is empty");
        return res.status(500).json({ message: "JWTKEY is empty" });
      }
      // const authToken = jwt.sign(req.user._json, JWT_KEY, options);
      const authToken = jwt.sign(payload, JWT_KEY, options);

      // await UserService.registerUser(userOAuth);
      await UserService.registerUserOAuth(userOAuth);
      // console.log(response);

      return res.redirect(`${FRONTEND_URL}?token=${authToken}`);
      // res.redirect("/profile");
    },
  );

  // Logout route
  app.get("/auth/logout", (req: Request, res: Response) => {
    req.logout(() => {
      res.redirect("/");
    });
  });
};

export default passport;
