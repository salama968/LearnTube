import { Router } from "express";
import passport from "passport";
import {
  handleGoogleCallback,
  getCurrentUser,
  logout,
} from "../controllers/auth.controller.ts";
import { requireAuth } from "../middleware/auth.middleware.ts";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/failure",
  }),
  handleGoogleCallback as any
);

router.get("/me", requireAuth as any, getCurrentUser as any);

router.post("/logout", requireAuth as any, logout as any);

router.get("/failure", (req, res) => {
  res.status(401).json({ error: "Authentication failed" });
});

export default router;
