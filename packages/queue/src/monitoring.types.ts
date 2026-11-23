// packages/queue/src/monitoring.types.ts

export interface MonitoringJobData {
  websiteId: string;
  url: string;
  regionId: string;
  method?: string;
  timeoutMs?: number;
  expectedStatusCode?: number;
}
