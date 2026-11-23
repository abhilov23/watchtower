import { Router } from "express";

import {
  registerController,
  loginController,
  logoutController,
  meController,
  forgotPasswordController,
  resetPasswordController,
} from "./auth.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// Authentication
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.get("/me", authMiddleware, meController);

// Password Reset with Resend
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password/request", forgotPasswordController);
router.post("/reset-password", resetPasswordController);

export default router;
