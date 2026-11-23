import { prismaClient, WebsiteStatus } from "@watchtower/db";
import type { MonitoringJobData } from "@watchtower/queue";
import type { RegionInfo } from "./region.js";
import { config } from "./config.js";

export async function performHealthCheck(
  data: MonitoringJobData,
  currentRegion?: RegionInfo | null,
): Promise<void> {
  const startTime = performance.now();
  let status: WebsiteStatus = WebsiteStatus.DOWN;
  let statusCode: number | null = null;
  const timeoutMs = data.timeoutMs || config.defaultTimeoutMs;
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
