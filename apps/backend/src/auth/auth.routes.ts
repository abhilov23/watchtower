import { Router } from "express";

import {
  registerController,
  loginController,
  logoutController,
  meController,
  updateProfileController,
  forgotPasswordController,
  resetPasswordController,
} from "./auth.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { authRateLimiter } from "../middleware/rate-limiter.middleware.js";

const router = Router();

// Authentication
router.post("/register", authRateLimiter, registerController);
router.post("/login", authRateLimiter, loginController);
router.post("/logout", logoutController);
router.get("/me", authMiddleware, meController);
router.patch("/me", authMiddleware, updateProfileController);

// Password Reset with Resend
router.post("/forgot-password", authRateLimiter, forgotPasswordController);
router.post(
  "/reset-password/request",
  authRateLimiter,
  forgotPasswordController,
);
router.post("/reset-password", authRateLimiter, resetPasswordController);

export default router;
