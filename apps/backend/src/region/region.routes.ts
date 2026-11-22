import { Router } from "express";

import {
  getRegionsController,
  getRegionByIdController,
} from "./region.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// GET ALL REGIONS
router.get("/", authMiddleware, getRegionsController);

// GET REGION BY ID
router.get("/:regionId", authMiddleware, getRegionByIdController);

export default router;
