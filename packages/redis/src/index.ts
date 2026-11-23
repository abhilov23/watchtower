import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

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
