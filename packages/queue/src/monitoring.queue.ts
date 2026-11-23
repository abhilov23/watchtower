// packages/queue/src/monitoring.queue.ts

import { Queue } from "bullmq";
import { queueConnection } from "./connection.js";
import type { MonitoringJobData } from "./monitoring.types.js";

export const MONITORING_QUEUE_NAME = "monitoring";

const queueCache = new Map<string, Queue<MonitoringJobData>>();

export function getRegionQueueName(regionId?: string): string {
  if (!regionId || regionId === "default" || regionId === "all") {
    return MONITORING_QUEUE_NAME;
  }
  // BullMQ queues CANNOT contain colon (:)
  const sanitized = regionId.replace(/[^a-zA-Z0-9_-]/g, "_");
  return `monitoring_${sanitized}`;
}

export function getMonitoringQueue(
  regionId?: string,
): Queue<MonitoringJobData> {
  const name = getRegionQueueName(regionId);
  const cached = queueCache.get(name);
  if (cached) return cached;

  const queue = new Queue<MonitoringJobData>(name, {
    connection: queueConnection,
    defaultJobOptions: {
      removeOnComplete: 100,
      removeOnFail: 200,
    },
  });
  queueCache.set(name, queue);
  return queue;
}

export const monitoringQueue = getMonitoringQueue();
