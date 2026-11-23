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

import { Worker, type Job } from "bullmq";
import {
  queueConnection,
  getRegionQueueName,
  type MonitoringJobData,
} from "@watchtower/queue";
import { prismaClient, WebsiteStatus } from "@watchtower/db";

const CONCURRENCY = parseInt(process.env.CONCURRENCY || "10", 10);
const POLL_INTERVAL_MS =
  parseInt(process.env.POLL_INTERVAL_SECONDS || "15", 10) * 1000;

interface RegionInfo {
  id: string;
  name: string;
  code: string;
}

let currentRegion: RegionInfo | null = null;

async function resolveWorkerRegion(): Promise<RegionInfo | null> {
  const regionId = process.env.REGION_ID;
  const regionCode = process.env.REGION_CODE;

  if (regionId) {
    const region = await prismaClient.region.findUnique({
      where: { id: regionId },
    });
    if (region) {
      return { id: region.id, name: region.name, code: region.code };
    }
    console.warn(
      `[Watchtower Worker] Specified REGION_ID "${regionId}" not found in DB.`,
    );
  }

  if (regionCode) {
    const region = await prismaClient.region.findUnique({
      where: { code: regionCode },
    });
    if (region) {
      return { id: region.id, name: region.name, code: region.code };
    }
    console.warn(
      `[Watchtower Worker] Specified REGION_CODE "${regionCode}" not found in DB.`,
    );
  }

  // Fallback: pick first available enabled region or null
  const defaultRegion = await prismaClient.region.findFirst({
    where: { enabled: true },
    orderBy: { name: "asc" },
  });

  if (defaultRegion) {
    console.log(
      `[Watchtower Worker] No valid REGION_ID or REGION_CODE supplied. Defaulting to region "${defaultRegion.name}" (${defaultRegion.code})`,
    );
    return {
      id: defaultRegion.id,
      name: defaultRegion.name,
      code: defaultRegion.code,
    };
  }

  return null;
}

async function performHealthCheck(data: MonitoringJobData): Promise<void> {
  const startTime = performance.now();
  let status: WebsiteStatus = WebsiteStatus.DOWN;
  let statusCode: number | null = null;
  const timeoutMs = data.timeoutMs || 10000;
  let responseTimeMs = timeoutMs;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(data.url, {
      method: data.method || "GET",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Watchtower-Monitoring-Worker/1.0 (+https://watchtower.dev)",
        Accept: "*/*",
      },
    });

    clearTimeout(timeoutId);
    responseTimeMs = Math.max(1, Math.round(performance.now() - startTime));
    statusCode = response.status;
    const expected = data.expectedStatusCode || 200;
    const isUp =
      statusCode === expected || (statusCode >= 200 && statusCode < 400);
    status = isUp ? WebsiteStatus.UP : WebsiteStatus.DOWN;
  } catch (_err) {
    responseTimeMs = Math.max(1, Math.round(performance.now() - startTime));
    status = WebsiteStatus.DOWN;
    statusCode = null;
  }

  try {
    await prismaClient.websiteTick.create({
      data: {
        websiteId: data.websiteId,
        regionId: data.regionId,
        status,
        statusCode,
        responseTimeMs,
      },
    });

    const regionTag = currentRegion
      ? currentRegion.code
      : data.regionId.slice(0, 8);
    console.log(
      `[Worker:${regionTag}] Checked "${data.url}" -> ${status} (${statusCode ?? "TIMEOUT/ERR"}, ${responseTimeMs}ms)`,
    );
  } catch (dbErr) {
    console.error("[Watchtower Worker] Database write error:", dbErr);
  }
}

// Autonomous scheduler loop: ping active websites assigned to this region
async function runAutonomousCheckCycle(regionId: string): Promise<void> {
  try {
    const activeSites = await prismaClient.website.findMany({
      where: {
        monitorStatus: "ACTIVE",
        regions: {
          some: {
            regionId,
          },
        },
      },
      include: {
        ticks: {
          where: { regionId },
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    const now = Date.now();

    for (const site of activeSites) {
      const lastTick = site.ticks[0];
      const intervalMs = (site.intervalSeconds || 60) * 1000;
      const shouldCheck =
        !lastTick || now - lastTick.createdAt.getTime() >= intervalMs;

      if (shouldCheck) {
        await performHealthCheck({
          websiteId: site.id,
          url: site.url,
          regionId,
          method: site.method,
          timeoutMs: site.timeoutMs,
          expectedStatusCode: site.expectedStatusCode,
        });
      }
    }
  } catch (err) {
    console.error(
      "[Watchtower Worker] Error during autonomous check cycle:",
      err,
    );
  }
}

async function main() {
  console.log("==========================================");
  console.log("       WATCHTOWER MONITORING WORKER       ");
  console.log("==========================================");

  currentRegion = await resolveWorkerRegion();

  if (currentRegion) {
    console.log(
      `[Watchtower Worker] Stationed at Region: "${currentRegion.name}" [code: ${currentRegion.code}, id: ${currentRegion.id}]`,
    );
  } else {
    console.log("[Watchtower Worker] Running in Global Fallback Mode");
  }

  const queueName = currentRegion
    ? getRegionQueueName(currentRegion.id)
    : getRegionQueueName();

  console.log(`[Watchtower Worker] Listening on BullMQ queue: "${queueName}"`);

  // BullMQ Worker for on-demand and queued checks
  const worker = new Worker<MonitoringJobData>(
    queueName,
    async (job: Job<MonitoringJobData>) => {
      await performHealthCheck(job.data);
    },
    {
      connection: queueConnection,
      concurrency: CONCURRENCY,
    },
  );

  worker.on("ready", () => {
    console.log(
      `[Watchtower Worker] Worker is connected and ready (concurrency: ${CONCURRENCY}).`,
    );
  });

  worker.on("failed", (job, err) => {
    console.error(`[Watchtower Worker] Job ${job?.id} failed:`, err);
  });

  // Also listen on general "monitoring" queue if stationed in a specific region
  let globalWorker: Worker<MonitoringJobData> | null = null;
  if (currentRegion) {
    globalWorker = new Worker<MonitoringJobData>(
      "monitoring",
      async (job: Job<MonitoringJobData>) => {
        // If job specifies this region or no specific region, process it
        if (!job.data.regionId || job.data.regionId === currentRegion?.id) {
          await performHealthCheck({
            ...job.data,
            regionId: currentRegion ? currentRegion.id : job.data.regionId,
          });
        }
      },
      {
        connection: queueConnection,
        concurrency: 5,
      },
    );
  }

  // Start autonomous recurring monitoring cycle
  if (currentRegion) {
    console.log(
      `[Watchtower Worker] Starting autonomous polling cycle every ${POLL_INTERVAL_MS / 1000}s`,
    );
    // Run initial cycle after 2 seconds
    setTimeout(() => {
      runAutonomousCheckCycle(currentRegion!.id);
    }, 2000);

    // Set recurring timer
    setInterval(() => {
      if (currentRegion) {
        runAutonomousCheckCycle(currentRegion.id);
      }
    }, POLL_INTERVAL_MS);
  }

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(
      `\n[Watchtower Worker] Received ${signal}. Shutting down gracefully...`,
    );
    await worker.close();
    if (globalWorker) {
      await globalWorker.close();
    }
    await prismaClient.$disconnect();
    await queueConnection.quit();
    process.exit(0);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

main().catch((err) => {
  console.error("[Watchtower Worker] Fatal startup error:", err);
  process.exit(1);
});
