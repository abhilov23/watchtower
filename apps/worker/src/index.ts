import { config } from "./config.js";
import { resolveWorkerRegion, type RegionInfo } from "./region.js";
import { setupQueueWorkers } from "./queue-worker.js";
import { startAutonomousScheduler } from "./scheduler.js";
import { prismaClient } from "@watchtower/db";
import { queueConnection } from "@watchtower/queue";

async function main() {
  console.log("==========================================");
  console.log("       WATCHTOWER MONITORING WORKER       ");
  console.log("==========================================");

  const region: RegionInfo | null = await resolveWorkerRegion();

  if (region) {
    console.log(
      `[Watchtower Worker] Stationed at Region: "${region.name}" [code: ${region.code}, id: ${region.id}]`,
    );
  } else {
    console.log("[Watchtower Worker] Running in Global Fallback Mode");
  }

  // Initialize BullMQ workers
  const workerGroup = setupQueueWorkers(region);

  // Initialize autonomous background scheduler
  let stopScheduler: (() => void) | null = null;
  if (region) {
    stopScheduler = startAutonomousScheduler(region, config.pollIntervalMs);
  }

  // Graceful shutdown handling
  const shutdown = async (signal: string) => {
    console.log(
      `\n[Watchtower Worker] Received ${signal}. Shutting down gracefully...`,
    );
    if (stopScheduler) {
      stopScheduler();
    }
    await workerGroup.close();
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
