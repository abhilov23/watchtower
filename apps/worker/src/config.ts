import dotenv from "dotenv";
dotenv.config();

// Workspace fallback for database and redis env if not set
import { fileURLToPath } from "node:url";
if (!process.env.DATABASE_URL) {
  dotenv.config({
    path: fileURLToPath(new URL("../../packages/db/.env", import.meta.url)),
  });
}
if (!process.env.REDIS_URL) {
  dotenv.config({
    path: fileURLToPath(new URL("../../packages/redis/.env", import.meta.url)),
  });
}

export const config = {
  regionId: process.env.REGION_ID || undefined,
  regionCode: process.env.REGION_CODE || undefined,
  concurrency: parseInt(process.env.CONCURRENCY || "10", 10),
  pollIntervalMs:
    parseInt(process.env.POLL_INTERVAL_SECONDS || "15", 10) * 1000,
  defaultTimeoutMs: parseInt(process.env.DEFAULT_TIMEOUT_MS || "10000", 10),
};
