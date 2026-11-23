import { prismaClient } from "@watchtower/db";
import { config } from "./config.js";

export interface RegionInfo {
  id: string;
  name: string;
  code: string;
}

export async function resolveWorkerRegion(): Promise<RegionInfo | null> {
  const { regionId, regionCode } = config;

  if (regionId) {
    const region = await prismaClient.region.findUnique({
      where: { id: regionId },
    });
    if (region) {
      return { id: region.id, name: region.name, code: region.code };
    }
    console.warn(
      `[Watchtower Worker] Specified REGION_ID "${regionId}" not found in database.`,
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
      `[Watchtower Worker] Specified REGION_CODE "${regionCode}" not found in database.`,
    );
  }

  // Fallback: pick the first available enabled region
  const defaultRegion = await prismaClient.region.findFirst({
    where: { enabled: true },
    orderBy: { name: "asc" },
  });

  if (defaultRegion) {
    console.log(
      `[Watchtower Worker] No valid REGION_ID or REGION_CODE specified. Defaulting to region "${defaultRegion.name}" (${defaultRegion.code})`,
    );
    return {
      id: defaultRegion.id,
      name: defaultRegion.name,
      code: defaultRegion.code,
    };
  }

  return null;
}
