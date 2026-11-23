import { Request, Response } from "express";
import {
  register,
  login,
  deleteSession,
  getUserById,
  requestPasswordReset,
  resetPassword,
} from "./auth.service.js";

export async function registerController(req: Request, res: Response) {
  try {
    const { email, username, password } = req.body || {};

    if (!email || !username || !password) {
      return res.status(400).json({
        success: false,
        message: "Email, username, and password are required.",
      });
    }

    const result = await register(email, username, password);

    if (result !== "success") {
      return res.status(400).json({
        success: false,
        message: result,
      });
    }

    return res.status(201).json({
      success: true,
      message: "user registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to register",
    });
  }
}

export async function loginController(req: Request, res: Response) {
  try {
    const { identifier, password } = req.body || {};

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Identifier and password are required.",
      });
    }

    const sessionId = await login(identifier, password);

    if (sessionId === "invalid credentials") {
      return res.status(401).json({
        success: false,
        message: "invalid credentials",
      });
    }

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "logged in successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to login",
    });
  }
}

export async function logoutController(req: Request, res: Response) {
  try {
    const sessionId = req.cookies?.sessionId;

    if (sessionId) {
      await deleteSession(sessionId);
    }

    res.clearCookie("sessionId");

    return res.status(200).json({
      success: true,
      message: "logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to logout",
    });
  }
}

export async function meController(req: Request, res: Response) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch profile",
    });
  }
}

export async function forgotPasswordController(req: Request, res: Response) {
  try {
    const { email } = req.body || {};

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email address.",
      });
    }

    const result = await requestPasswordReset(email);

    return res.status(200).json({
      success: true,
      message: "If an account with that email exists, a password reset link has been sent.",
      ...(process.env.NODE_ENV !== "production" && result.link ? { debugLink: result.link } : {}),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to process password reset",
    });
  }
}

export async function resetPasswordController(req: Request, res: Response) {
  try {
    const { token, password, newPassword } = req.body || {};
    const finalPassword = password || newPassword;

    if (!token || !finalPassword) {
      return res.status(400).json({
        success: false,
        message: "Reset token and new password are required.",
      });
    }

    const result = await resetPassword(token, finalPassword);

    if (result !== "success") {
      return res.status(400).json({
        success: false,
        message: result,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now log in.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to reset password",
    });
  }
}
