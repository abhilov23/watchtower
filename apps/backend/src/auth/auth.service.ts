import argon2 from "argon2";
import { prismaClient } from "@watchtower/db";
import { getRedis } from "../lib/redis.js";
import { sendPasswordResetEmail } from "../lib/resend.js";
import crypto from "crypto";

/**
 * register() => registers the user
 * login() => allow user to login
 * createSession() => creates redis session
 * validateSession() => validates the session
 * deleteSession() => deletes the session
 * requestPasswordReset() => generates token and sends email via Resend
 * resetPassword() => validates token and updates password
 * getUserById() => retrieves user details by id
 */

export async function register(
  email: string,
  username: string,
  password: string,
): Promise<string> {
  const existingUser = await prismaClient.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    return "username or email already exist";
  }

  const passwordHash = await argon2.hash(password);

  await prismaClient.user.create({
    data: {
      email,
      username,
      password: passwordHash,
    },
  });

  return "success";
}

export async function login(identifier: string, password: string) {
  const user = await prismaClient.user.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
    },
  });

  if (!user) {
    return "invalid credentials";
  }

  const validPassword = await argon2.verify(user.password, password);

  if (!validPassword) {
    return "invalid credentials";
  }

  const sessionId = await createSession(user.id);

  return sessionId;
}

export async function createSession(userId: string): Promise<string> {
  const redis = await getRedis();
  const sessionId = crypto.randomBytes(32).toString("hex");

  await redis.set(`session:${sessionId}`, userId, {
    expiration: {
      type: "EX",
      value: 60 * 60 * 24 * 7, // 7 days
    },
  });

  return sessionId;
}

export async function validateSession(
  sessionId: string,
): Promise<string | null> {
  const redis = await getRedis();

  const userId = await redis.get(`session:${sessionId}`);

  if (!userId) {
    return null;
  }

  return userId;
}

export async function deleteSession(sessionId: string): Promise<void> {
  const redis = await getRedis();

  await redis.del(`session:${sessionId}`);
}

export async function getUserById(userId: string) {
  return prismaClient.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
    },
  });
}

export async function requestPasswordReset(email: string) {
  const user = await prismaClient.user.findFirst({
    where: { email },
  });

  // Always return success even if user not found to prevent user enumeration
  if (!user) {
    return { success: true };
  }

  const token = crypto.randomBytes(32).toString("hex");
  const redis = await getRedis();

  // Store password reset token for 1 hour
  await redis.set(`password_reset:${token}`, user.id, {
    expiration: {
      type: "EX",
      value: 60 * 60, // 1 hour
    },
  });

  const emailResult = await sendPasswordResetEmail(user.email, token);
  return { success: true, emailSent: emailResult.sent, link: emailResult.link };
}

export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<string> {
  if (!token || !newPassword) {
    return "token and new password are required";
  }

  if (newPassword.length < 6) {
    return "password must be at least 6 characters";
  }

  const redis = await getRedis();
  const userId = await redis.get(`password_reset:${token}`);

  if (!userId) {
    return "invalid or expired token";
  }

  const passwordHash = await argon2.hash(newPassword);

  await prismaClient.user.update({
    where: { id: userId },
    data: { password: passwordHash },
  });

  // Invalidate reset token after successful reset
  await redis.del(`password_reset:${token}`);

  return "success";
}
