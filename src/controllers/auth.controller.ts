import type { Response } from "express";
import type { RequestWithUser } from "../utils/types.ts";
import { findOrCreateUser } from "../services/user.service.ts";
import { generateJwt } from "../utils/auth.utils.ts";

export async function handleGoogleCallback(
  req: RequestWithUser,
  res: Response
): Promise<void> {
  try {
    const profile = req.user as any;

    if (!profile) {
      res.status(400).json({ error: "No profile data received" });
      return;
    }

    const user = await findOrCreateUser({
      googleId: profile.id,
      email: profile.emails?.[0]?.value || "",
      name: profile.displayName || "",
      avatarUrl: profile.photos?.[0]?.value,
    });

    const token = generateJwt({
      userId: user.id,
      email: user.email,
    });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  } catch (error) {
    console.error("Google callback error:", error);
    res.status(500).json({
      error: "Authentication failed",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export function getCurrentUser(req: RequestWithUser, res: Response): void {
  const user = req.user;

  if (!user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  res.json({ user });
}

export function logout(req: RequestWithUser, res: Response): void {
  res.json({ message: "Logged out successfully" });
}
