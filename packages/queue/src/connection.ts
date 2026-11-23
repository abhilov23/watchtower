import { Redis } from "ioredis";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

// Load environment variables if REDIS_URL is not yet defined
if (!process.env.REDIS_URL) {
  dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });
}
if (!process.env.REDIS_URL) {
  dotenv.config({ path: fileURLToPath(new URL("../../redis/.env", import.meta.url)) });
}
if (!process.env.REDIS_URL) {
  dotenv.config({ path: fileURLToPath(new URL("../../../apps/tests/.env", import.meta.url)) });
}

export function createQueueConnection(customUrl?: string): Redis {
  const url = customUrl || process.env.REDIS_URL;
  if (!url) {
    throw new Error("REDIS_URL is not defined in environment variables");
  }

  const client = new Redis(url, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });

  client.on("error", (err) => {
    console.error("[Watchtower Queue Redis] Error:", err);
  });

  return client;
}

const redisUrl = process.env.REDIS_URL;

export const queueConnection: Redis = new Redis(redisUrl || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  lazyConnect: true,
});

queueConnection.on("error", (err) => {
  console.error("[Watchtower Queue Redis Connection] Error:", err);
});

export { Redis };
