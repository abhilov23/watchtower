import { Request, Response, NextFunction } from "express";
import { getRedis } from "@watchtower/redis";

const MUTATING_METHODS = new Set(["POST", "PATCH", "PUT", "DELETE"]);

export async function idempotencyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!MUTATING_METHODS.has(req.method.toUpperCase())) {
    return next();
  }

  const idempotencyKey =
    (req.headers["idempotency-key"] as string) ||
    (req.headers["x-idempotency-key"] as string);

  if (!idempotencyKey) {
    return next();
  }

  // Validate format (alphanumeric, dashes, underscores, max 128 chars)
  if (
    idempotencyKey.length > 128 ||
    !/^[a-zA-Z0-9_\-.:]+$/.test(idempotencyKey)
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid Idempotency-Key format. Allowed: alphanumeric, dashes, colons, and underscores (max 128 chars).",
    });
  }

  const scope = req.userId || req.ip || "global";
  const redisKey = `idempotency:${scope}:${idempotencyKey}`;

  try {
    const redis = await getRedis();
    const cached = await redis.get(redisKey);

    if (cached) {
      if (cached === "IN_PROGRESS") {
        return res.status(409).json({
          success: false,
          message:
            "A request with this Idempotency-Key is currently being processed. Please retry shortly.",
        });
      }

      try {
        const parsed = JSON.parse(cached);
        res.setHeader("X-Cache-Lookup", "HIT");
        res.setHeader("Idempotent-Replayed", "true");
        res.setHeader("Idempotency-Key", idempotencyKey);
        return res.status(parsed.statusCode || 200).json(parsed.body);
      } catch {
        // Stale or corrupted cache entry, proceed normally
      }
    }

    // Set lock in progress for 60 seconds
    await redis.set(redisKey, "IN_PROGRESS", {
      expiration: { type: "EX", value: 60 },
    });

    const originalJson = res.json.bind(res);
    const originalSend = res.send.bind(res);

    res.json = (body: any) => {
      res.setHeader("Idempotency-Key", idempotencyKey);

      // Only cache successful or client error responses (don't cache 500s)
      if (res.statusCode < 500) {
        redis
          .set(
            redisKey,
            JSON.stringify({ statusCode: res.statusCode, body }),
            { expiration: { type: "EX", value: 86400 } }, // 24 hours
          )
          .catch((err) => {
            console.warn(
              "[Idempotency] Failed to cache response in Redis:",
              err,
            );
          });
      } else {
        redis.del(redisKey).catch(() => {});
      }

      return originalJson(body);
    };

    res.send = (body: any) => {
      res.setHeader("Idempotency-Key", idempotencyKey);

      if (res.statusCode < 500) {
        let parsed = body;
        try {
          if (typeof body === "string") parsed = JSON.parse(body);
        } catch {}

        redis
          .set(
            redisKey,
            JSON.stringify({ statusCode: res.statusCode, body: parsed }),
            { expiration: { type: "EX", value: 86400 } },
          )
          .catch((err) => {
            console.warn(
              "[Idempotency] Failed to cache response in Redis:",
              err,
            );
          });
      } else {
        redis.del(redisKey).catch(() => {});
      }

      return originalSend(body);
    };

    return next();
  } catch (err) {
    console.warn("[Idempotency] Redis error, failing open to proceed:", err);
    return next();
  }
}
