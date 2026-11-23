import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisUrl = process.env.REDIS_URL;

export function createQueueConnection(customUrl?: string): Redis {
  const url = customUrl || process.env.REDIS_URL;
  if (!url) {
    throw new Error("REDIS_URL is not defined in environment variables");
  }

  return new Redis(url, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });
}

export const queueConnection: Redis = new Redis(redisUrl || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  lazyConnect: true,
});

queueConnection.on("error", (err) => {
  console.error("[Watchtower Queue Redis] Error:", err);
});

export { Redis };
