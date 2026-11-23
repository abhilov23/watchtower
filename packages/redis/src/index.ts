import { createClient } from "redis";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

// Load environment variables if REDIS_URL is not already in process.env
if (!process.env.REDIS_URL) {
  dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });
}
if (!process.env.REDIS_URL) {
  dotenv.config({ path: fileURLToPath(new URL("../../apps/tests/.env", import.meta.url)) });
}

export type RedisClient = ReturnType<typeof createClient>;

declare global {
  var redisClientGlobal: RedisClient | undefined;
}

const connectionUrl = process.env.REDIS_URL;

export const redis: RedisClient =
  globalThis.redisClientGlobal ??
  createClient({
    url: connectionUrl,
  });

redis.on("error", (err: unknown) => {
  console.error("[Watchtower Redis] Error:", err);
});

if (process.env.NODE_ENV !== "production") {
  globalThis.redisClientGlobal = redis;
}

export async function getRedis(): Promise<RedisClient> {
  if (!redis.isOpen) {
    await redis.connect();
  }
  return redis;
}

export { createClient };
