import { Worker, type Job } from "bullmq";
import {
  queueConnection,
  getRegionQueueName,
  type MonitoringJobData,
} from "@watchtower/queue";
import { performHealthCheck } from "./checker.js";
import type { RegionInfo } from "./region.js";
import { config } from "./config.js";

export interface WorkerGroup {
  regionWorker: Worker<MonitoringJobData>;
  globalWorker: Worker<MonitoringJobData> | null;
  close: () => Promise<void>;
}

export function setupQueueWorkers(region: RegionInfo | null): WorkerGroup {
  const queueName = region
    ? getRegionQueueName(region.id)
    : getRegionQueueName();

  console.log(`[Watchtower Worker] Listening on BullMQ queue: "${queueName}"`);

  // Primary region worker
  const regionWorker = new Worker<MonitoringJobData>(
    queueName,
    async (job: Job<MonitoringJobData>) => {
      await performHealthCheck(job.data, region);
    },
    {
      connection: queueConnection,
      concurrency: config.concurrency,
    },
  );

  regionWorker.on("ready", () => {
    console.log(
      `[Watchtower Worker] Primary worker connected and ready (concurrency: ${config.concurrency}).`,
    );
  });

  regionWorker.on("failed", (job, err) => {
    console.error(`[Watchtower Worker] Job ${job?.id} failed:`, err);
  });

  // Secondary worker for global fallback jobs if assigned to a specific region
  let globalWorker: Worker<MonitoringJobData> | null = null;
  if (region) {
    globalWorker = new Worker<MonitoringJobData>(
      "monitoring",
      async (job: Job<MonitoringJobData>) => {
        // Only process if unassigned or explicitly targeting this region
        if (!job.data.regionId || job.data.regionId === region.id) {
          await performHealthCheck(
            {
              ...job.data,
              regionId: region.id,
            },
            region,
          );
        }
      },
      {
        connection: queueConnection,
        concurrency: Math.max(2, Math.floor(config.concurrency / 2)),
      },
    );

    globalWorker.on("failed", (job, err) => {
      console.error(
        `[Watchtower Worker] Global queue job ${job?.id} failed:`,
        err,
      );
    });
  }

  const close = async () => {
    await regionWorker.close();
    if (globalWorker) {
      await globalWorker.close();
    }
  };

  return { regionWorker, globalWorker, close };
}
