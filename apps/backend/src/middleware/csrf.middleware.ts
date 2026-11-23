import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function setCsrfCookie(res: Response, token: string): void {
  res.cookie("csrfToken", token, {
    httpOnly: false, // Must be readable by client JavaScript to supply in X-CSRF-Token header
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export function csrfProtection(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // If in test environment or explicitly disabled, bypass
  if (process.env.NODE_ENV === "test" || process.env.DISABLE_CSRF === "true") {
    return next();
  }

  // Ensure client has a CSRF cookie on any request
  let currentToken = req.cookies?.csrfToken;
  if (!currentToken || typeof currentToken !== "string") {
    currentToken = generateCsrfToken();
    setCsrfCookie(res, currentToken);
  }
  req.csrfToken = currentToken;

  // Safe methods (GET, HEAD, OPTIONS) do not alter server state
  if (SAFE_METHODS.has(req.method.toUpperCase())) {
    res.setHeader("X-CSRF-Token", currentToken);
    return next();
  }

  // If request uses non-ambient Bearer token authorization, CSRF is not applicable
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return next();
  }

  // State-changing methods (POST, PUT, PATCH, DELETE) require valid X-CSRF-Token header
  const headerToken =
    (req.headers["x-csrf-token"] as string) ||
    (req.headers["csrf-token"] as string);

  if (!headerToken) {
    return res.status(403).json({
      success: false,
      message: "CSRF token missing. Please include the X-CSRF-Token header.",
      code: "EBADCSRFTOKEN",
    });
  }

  const expectedBuffer = Buffer.from(currentToken, "utf-8");
  const providedBuffer = Buffer.from(headerToken, "utf-8");

  if (
    expectedBuffer.length !== providedBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, providedBuffer)
  ) {
    return res.status(403).json({
      success: false,
      message: "Invalid CSRF token. Please refresh the page and try again.",
      code: "EBADCSRFTOKEN",
    });
  }

  return next();
}

export function csrfTokenHandler(req: Request, res: Response) {
  let token = req.cookies?.csrfToken;
  if (!token || typeof token !== "string") {
    token = generateCsrfToken();
    setCsrfCookie(res, token);
  }
  res.setHeader("X-CSRF-Token", token);
  return res.status(200).json({
    success: true,
    csrfToken: token,
  });
}
