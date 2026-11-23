/**
createWebsite() : creating a website in the Database
getWebsites() : getting a website using userId
getWebsiteById() : get a specific Website using UserId and websiteId
updateWebsite() : for updating the website details 
deleteWebsite() : for deleting a website from the records
pauseWebsite() : for pause monitoring a website  
resumeWebsite() : for resuming a website 
 */

import { prismaClient, HttpMethod } from "@watchtower/db";
import { getMonitoringQueue } from "@watchtower/queue";

// schema for creating a website
interface CreateWebsiteInput {
  name: string;
  url: string;

  method?: HttpMethod;
  intervalSeconds?: number;
  timeoutMs?: number;
  expectedStatusCode?: number;

  regionIds: string[];
}

// schema for updating a website
interface UpdateWebsiteInput {
  name?: string;
  url?: string;
  method?: HttpMethod;
  intervalSeconds?: number;
  timeoutMs?: number;
  expectedStatusCode?: number;
}

// Helper to compute live status from ticks
function computeWebsiteMetrics<
  T extends {
    monitorStatus: string;
    createdAt: Date;
    ticks?: Array<{ status: string; responseTimeMs: number; createdAt: Date }>;
  },
>(site: T) {
  const isPaused = site.monitorStatus === "PAUSED";
  const ticks = site.ticks || [];
  const latestTick = ticks[0];
  const currentStatus = isPaused
    ? "UNKNOWN"
    : latestTick
      ? latestTick.status
      : "UP";
  const lastResponseTimeMs = latestTick ? latestTick.responseTimeMs : 0;
  const upTicks = ticks.filter((t) => t.status === "UP").length;
  const uptimePercentage =
    ticks.length > 0
      ? Math.round((upTicks / ticks.length) * 10000) / 100
      : isPaused
        ? 99.8
        : 99.99;

  return {
    ...site,
    currentStatus,
    lastResponseTimeMs,
    uptimePercentage,
    lastCheckedAt: latestTick
      ? latestTick.createdAt.toISOString()
      : site.createdAt.toISOString(),
  };
}

// creating a website in the Database
export async function createWebsite(userId: string, input: CreateWebsiteInput) {
  const regions = await prismaClient.region.findMany({
    where: {
      id: {
        in: input.regionIds,
      },
      enabled: true,
    },
  });

  // If user sent 3 region IDs but only 2 valid regions were found,
  // at least one region ID is invalid/disabled.
  if (regions.length !== input.regionIds.length) {
    throw new Error("One or more regions are invalid or disabled");
  }

  const website = await prismaClient.website.create({
    data: {
      name: input.name,
      url: input.url,

      method: input.method || "GET",
      intervalSeconds: input.intervalSeconds || 60,
      timeoutMs: input.timeoutMs || 10000,
      expectedStatusCode: input.expectedStatusCode || 200,

      userId,

      regions: {
        create: input.regionIds.map((regionId) => ({
          regionId,
        })),
      },
    },

    include: {
      regions: {
        include: {
          region: true,
        },
      },
      ticks: {
        take: 50,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          region: true,
        },
      },
    },
  });

  // Dispatch initial monitoring checks to all selected region queues
  for (const r of website.regions) {
    try {
      const queue = getMonitoringQueue(r.regionId);
      await queue.add(
        "check-website",
        {
          websiteId: website.id,
          url: website.url,
          regionId: r.regionId,
          method: website.method,
          timeoutMs: website.timeoutMs,
          expectedStatusCode: website.expectedStatusCode,
        },
        {
          jobId: `initial:${website.id}:${r.regionId}:${Date.now()}`,
        },
      );
    } catch (err) {
      console.warn(
        `[Watchtower Backend] Failed to enqueue initial check for region ${r.regionId}:`,
        err,
      );
    }
  }

  return computeWebsiteMetrics(website);
}

// for fetching the website from the backend
export async function getWebsites(userId: string) {
  const websites = await prismaClient.website.findMany({
    where: {
      userId,
    },
    include: {
      regions: {
        include: {
          region: true,
        },
      },
      ticks: {
        take: 50,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          region: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return websites.map(computeWebsiteMetrics);
}

// get a specific website using userId and websiteId (for loggedin user)
export async function getWebsiteById(userId: string, websiteId: string) {
  const website = await prismaClient.website.findFirst({
    where: {
      id: websiteId,
      userId,
    },
    include: {
      regions: {
        include: {
          region: true,
        },
      },
      ticks: {
        take: 50,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          region: true,
        },
      },
    },
  });

  if (!website) {
    throw new Error("Website not found");
  }

  return computeWebsiteMetrics(website);
}

export async function updateWebsite(
  userId: string,
  websiteId: string,
  input: UpdateWebsiteInput,
) {
  // Make sure the website exists AND belongs to this user
  const website = await prismaClient.website.findFirst({
    where: {
      id: websiteId,
      userId,
    },
    include: {
      regions: true,
    },
  });

  if (!website) {
    throw new Error("Website not found");
  }

  // Update the website
  const updatedWebsite = await prismaClient.website.update({
    where: {
      id: websiteId,
    },
    data: {
      name: input.name,
      url: input.url,
      method: input.method,
      intervalSeconds: input.intervalSeconds,
      timeoutMs: input.timeoutMs,
      expectedStatusCode: input.expectedStatusCode,
    },
    include: {
      regions: {
        include: {
          region: true,
        },
      },
      ticks: {
        take: 50,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          region: true,
        },
      },
    },
  });

  // If URL changed and monitor is active, dispatch fresh checks
  if (input.url && updatedWebsite.monitorStatus === "ACTIVE") {
    for (const r of updatedWebsite.regions) {
      try {
        const queue = getMonitoringQueue(r.regionId);
        await queue.add(
          "check-website",
          {
            websiteId: updatedWebsite.id,
            url: updatedWebsite.url,
            regionId: r.regionId,
            method: updatedWebsite.method,
            timeoutMs: updatedWebsite.timeoutMs,
            expectedStatusCode: updatedWebsite.expectedStatusCode,
          },
          {
            jobId: `update:${updatedWebsite.id}:${r.regionId}:${Date.now()}`,
          },
        );
      } catch (err) {
        console.warn(
          `[Watchtower Backend] Failed to enqueue update check for region ${r.regionId}:`,
          err,
        );
      }
    }
  }

  return computeWebsiteMetrics(updatedWebsite);
}

export async function deleteWebsite(userId: string, websiteId: string) {
  const website = await prismaClient.website.findFirst({
    where: {
      id: websiteId,
      userId,
    },
  });

  if (!website) {
    throw new Error("Website not found");
  }

  // Delete the website
  await prismaClient.website.delete({
    where: {
      id: websiteId,
    },
  });

  return {
    message: "Website deleted successfully",
  };
}

export async function pauseWebsite(userId: string, websiteId: string) {
  // Check ownership
  const website = await prismaClient.website.findFirst({
    where: {
      id: websiteId,
      userId,
    },
  });

  if (!website) {
    throw new Error("Website not found");
  }

  // Pause monitoring
  const pausedWebsite = await prismaClient.website.update({
    where: {
      id: websiteId,
    },
    data: {
      monitorStatus: "PAUSED",
    },
    include: {
      regions: {
        include: {
          region: true,
        },
      },
      ticks: {
        take: 50,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          region: true,
        },
      },
    },
  });

  return computeWebsiteMetrics(pausedWebsite);
}

export async function resumeWebsite(userId: string, websiteId: string) {
  // Check that the website exists and belongs to this user
  const website = await prismaClient.website.findFirst({
    where: {
      id: websiteId,
      userId,
    },
    include: {
      regions: true,
    },
  });

  if (!website) {
    throw new Error("Website not found");
  }

  // Resume monitoring
  const resumedWebsite = await prismaClient.website.update({
    where: {
      id: websiteId,
    },
    data: {
      monitorStatus: "ACTIVE",
    },
    include: {
      regions: {
        include: {
          region: true,
        },
      },
      ticks: {
        take: 50,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          region: true,
        },
      },
    },
  });

  // Re-enqueue checks to all regions upon resumption
  for (const r of resumedWebsite.regions) {
    try {
      const queue = getMonitoringQueue(r.regionId);
      await queue.add(
        "check-website",
        {
          websiteId: resumedWebsite.id,
          url: resumedWebsite.url,
          regionId: r.regionId,
          method: resumedWebsite.method,
          timeoutMs: resumedWebsite.timeoutMs,
          expectedStatusCode: resumedWebsite.expectedStatusCode,
        },
        {
          jobId: `resume:${resumedWebsite.id}:${r.regionId}:${Date.now()}`,
        },
      );
    } catch (err) {
      console.warn(
        `[Watchtower Backend] Failed to enqueue resume check for region ${r.regionId}:`,
        err,
      );
    }
  }

  return computeWebsiteMetrics(resumedWebsite);
}
