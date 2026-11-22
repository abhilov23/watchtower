import { Request, Response } from "express";

import { getRegions, getRegionById } from "./region.service.js";

interface RegionParams extends Record<string, string> {
  regionId: string;
}

// GET ALL REGIONS CONTROLLER
export async function getRegionsController(req: Request, res: Response) {
  try {
    const regions = await getRegions();

    return res.status(200).json({
      success: true,
      data: regions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch regions",
    });
  }
}

// GET REGION BY ID CONTROLLER
export async function getRegionByIdController(
  req: Request<RegionParams>,
  res: Response,
) {
  try {
    const regionId = req.params.regionId;

    const region = await getRegionById(regionId);

    return res.status(200).json({
      success: true,
      data: region,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : "Region not found",
    });
  }
}
