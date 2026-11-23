import { Request, Response, NextFunction } from "express";
import { getRedis } from "@watchtower/redis";

interface RateLimiterOptions {
  prefix: string;
  windowSeconds: number;
  maxRequests: number;
  message?: string;
  keyGenerator?: (req: Request) => string;
}

export function createRateLimiter(options: RateLimiterOptions) {
  const {
    prefix,
    windowSeconds,
    maxRequests,
    message = "Too many requests. Please slow down.",
    keyGenerator,
  } = options;

  return async function rateLimiterMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    if (process.env.NODE_ENV === "test") {
      return next();
    }

    const clientIp =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.ip ||
      req.socket.remoteAddress ||
      "127.0.0.1";

    const identifier = keyGenerator
      ? keyGenerator(req)
      : req.userId || clientIp;
    const redisKey = `ratelimit:${prefix}:${identifier}`;

    try {
      const redis = await getRedis();
      const current = await redis.incr(redisKey);

      if (current === 1) {
        await redis.expire(redisKey, windowSeconds);
      }

      const ttl = await redis.ttl(redisKey);
      const remaining = Math.max(0, maxRequests - current);
      const resetTime =
        Math.ceil(Date.now() / 1000) + (ttl > 0 ? ttl : windowSeconds);

      res.setHeader("X-RateLimit-Limit", maxRequests);
      res.setHeader("X-RateLimit-Remaining", remaining);
      res.setHeader("X-RateLimit-Reset", resetTime);

      if (current > maxRequests) {
        res.setHeader("Retry-After", ttl > 0 ? ttl : windowSeconds);
        return res.status(429).json({
          success: false,
          message,
          retryAfter: ttl > 0 ? ttl : windowSeconds,
        });
      }

      return next();
    } catch (err) {
      console.warn(
        `[RateLimiter:${prefix}] Redis check failed, failing open:`,
        err,
      );
      return next();
    }
  };
}

// Strict rate limiter for authentication routes: 10 requests per minute per IP
export const authRateLimiter = createRateLimiter({
  prefix: "auth",
  windowSeconds: 60,
  maxRequests: 10,
  message:
    "Too many authentication attempts. Please try again after 60 seconds.",
  keyGenerator: (req) => {
    return (
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.ip ||
      "127.0.0.1"
    );
  },
});

// General API rate limiter: 120 requests per minute per IP/User
export const apiRateLimiter = createRateLimiter({
  prefix: "api",
  windowSeconds: 60,
  maxRequests: 120,
  message: "API rate limit exceeded. Please slow down.",
});
