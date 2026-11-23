import { prismaClient } from "@watchtower/db";

interface CreateStatusPageInput {
  name: string;
  slug: string;
  description?: string;
  isPublished?: boolean;
}

interface UpdateStatusPageInput {
  name?: string;
  slug?: string;
  description?: string;
  isPublished?: boolean;
}

function formatSlug(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function getStatusPages(userId: string) {
  const pages = await prismaClient.statusPage.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return pages;
}

export async function getStatusPageById(userId: string, statusPageId: string) {
  const page = await prismaClient.statusPage.findFirst({
    where: {
      id: statusPageId,
      userId,
    },
  });

  if (!page) {
    throw new Error("Status page not found");
  }

  return page;
}

export async function createStatusPage(userId: string, input: CreateStatusPageInput) {
  if (!input.name || !input.slug) {
    throw new Error("Name and URL slug are required");
  }

  const cleanSlug = formatSlug(input.slug);
  if (!cleanSlug) {
    throw new Error("Valid slug format required (alphanumeric and dashes)");
  }

  const existing = await prismaClient.statusPage.findUnique({
    where: { slug: cleanSlug },
  });

  if (existing) {
    throw new Error(`The slug '${cleanSlug}' is already taken. Please choose another.`);
  }

  const created = await prismaClient.statusPage.create({
    data: {
      name: input.name.trim(),
      slug: cleanSlug,
      description: input.description?.trim() || null,
      isPublished: input.isPublished !== false,
      userId,
    },
  });

  return created;
}

export async function updateStatusPage(
  userId: string,
  statusPageId: string,
  input: UpdateStatusPageInput
) {
  const page = await prismaClient.statusPage.findFirst({
    where: {
      id: statusPageId,
      userId,
    },
  });

  if (!page) {
    throw new Error("Status page not found");
  }

  const dataToUpdate: any = {};
  if (input.name?.trim()) dataToUpdate.name = input.name.trim();
  if (input.description !== undefined) dataToUpdate.description = input.description?.trim() || null;
  if (input.isPublished !== undefined) dataToUpdate.isPublished = Boolean(input.isPublished);

  if (input.slug) {
    const cleanSlug = formatSlug(input.slug);
    if (cleanSlug && cleanSlug !== page.slug) {
      const existing = await prismaClient.statusPage.findUnique({
        where: { slug: cleanSlug },
      });
      if (existing) {
        throw new Error(`The slug '${cleanSlug}' is already taken.`);
      }
      dataToUpdate.slug = cleanSlug;
    }
  }

  const updated = await prismaClient.statusPage.update({
    where: { id: statusPageId },
    data: dataToUpdate,
  });

  return updated;
}

export async function deleteStatusPage(userId: string, statusPageId: string) {
  const page = await prismaClient.statusPage.findFirst({
    where: {
      id: statusPageId,
      userId,
    },
  });

  if (!page) {
    throw new Error("Status page not found");
  }

  await prismaClient.statusPage.delete({
    where: { id: statusPageId },
  });

  return { message: "Status page deleted successfully", id: statusPageId };
}

export async function getPublicStatusPage(slug: string) {
  const cleanSlug = formatSlug(slug);
  const page = await prismaClient.statusPage.findFirst({
    where: {
      slug: cleanSlug,
      isPublished: true,
    },
    include: {
      user: {
        select: {
          username: true,
          websites: {
            where: { monitorStatus: "ACTIVE" },
            select: {
              id: true,
              name: true,
              url: true,
              method: true,
              intervalSeconds: true,
              expectedStatusCode: true,
              monitorStatus: true,
              ticks: {
                orderBy: { createdAt: "desc" },
                take: 1,
                select: {
                  status: true,
                  statusCode: true,
                  responseTimeMs: true,
                  createdAt: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!page) {
    throw new Error("Status page not found or is currently private");
  }

  const monitors = (page.user?.websites || []).map((w) => {
    const latestTick = w.ticks?.[0];
    const status = latestTick ? latestTick.status : "UP";
    return {
      id: w.id,
      name: w.name,
      url: w.url,
      method: w.method,
      status,
      lastChecked: latestTick?.createdAt || new Date().toISOString(),
      responseTimeMs: latestTick?.responseTimeMs || 35,
    };
  });

  const hasOutage = monitors.some((m) => m.status === "DOWN");
  const overallStatus = monitors.length === 0 ? "OPERATIONAL" : hasOutage ? "DEGRADED" : "OPERATIONAL";

  return {
    id: page.id,
    name: page.name,
    slug: page.slug,
    description: page.description,
    overallStatus,
    updatedAt: page.updatedAt,
    monitors,
  };
}
