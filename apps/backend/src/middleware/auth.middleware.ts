import { Request, Response, NextFunction } from "express";
import { validateSession } from "../auth/auth.service.js";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const bearer = req.headers["authorization"]?.startsWith("Bearer ")
      ? req.headers["authorization"].split(" ")[1]
      : undefined;

    const sessionId = req.cookies?.sessionId || bearer;

    if (!sessionId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userId = await validateSession(sessionId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "InvalidSession",
      });
    }

    req.userId = userId;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : "Authentication failed",
    });
  }
}
