import { prismaClient } from "@watchtower/db";

// GET ALL REGIONS
export async function getRegions() {
  const regions = await prismaClient.region.findMany({
    where: {
      enabled: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return regions;
}

// GET REGION BY ID
export async function getRegionById(regionId: string) {
  const region = await prismaClient.region.findFirst({
    where: {
      id: regionId,
      enabled: true,
    },
  });

  if (!region) {
    throw new Error("Region not found");
  }

  return region;
}
