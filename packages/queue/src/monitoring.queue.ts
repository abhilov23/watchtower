// packages/queue/src/monitoring.queue.ts

import { Queue } from "bullmq";
import { queueConnection } from "./connection.js";
import type { MonitoringJobData } from "./monitoring.types.js";

export const MONITORING_QUEUE_NAME = "monitoring";

export const monitoringQueue = new Queue<MonitoringJobData>(
  MONITORING_QUEUE_NAME,
  {
    connection: queueConnection,
  }
);
