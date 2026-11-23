import { prismaClient } from "@watchtower/db";
import { performHealthCheck } from "./checker.js";
import type { RegionInfo } from "./region.js";

export async function runAutonomousCheckCycle(
  region: RegionInfo,
): Promise<void> {
  try {
    const activeSites = await prismaClient.website.findMany({
      where: {
        monitorStatus: "ACTIVE",
        regions: {
          some: {
            regionId: region.id,
          },
        },
      },
      include: {
        ticks: {
          where: { regionId: region.id },
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
        await performHealthCheck(
          {
            websiteId: site.id,
            url: site.url,
            regionId: region.id,
            method: site.method,
            timeoutMs: site.timeoutMs,
            expectedStatusCode: site.expectedStatusCode,
          },
          region,
        );
      }
    }
  } catch (err) {
    console.error(
      "[Watchtower Worker] Error during autonomous check cycle:",
      err,
    );
  }
}

export function startAutonomousScheduler(
  region: RegionInfo,
  pollIntervalMs: number,
): () => void {
  console.log(
    `[Watchtower Worker] Starting autonomous polling cycle every ${pollIntervalMs / 1000}s`,
  );

  // Initial cycle after warm-up delay
  const initialTimer = setTimeout(() => {
    runAutonomousCheckCycle(region);
  }, 2000);

  // Recurring interval
  const intervalTimer = setInterval(() => {
    runAutonomousCheckCycle(region);
  }, pollIntervalMs);

  return () => {
    clearTimeout(initialTimer);
    clearInterval(intervalTimer);
  };
}
