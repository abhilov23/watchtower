import { Router } from "express";

import {
  createWebsiteController,
  getWebsitesController,
  getWebsiteByIdController,
  updateWebsiteController,
  deleteWebsiteController,
  pauseWebsiteController,
  resumeWebsiteController,
} from "./website.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// CREATE WEBSITE
router.post("/", authMiddleware, createWebsiteController);

// GET ALL WEBSITES
router.get("/", authMiddleware, getWebsitesController);

// GET WEBSITE BY ID
router.get("/:websiteId", authMiddleware, getWebsiteByIdController);

// UPDATE WEBSITE
router.patch("/:websiteId", authMiddleware, updateWebsiteController);

// DELETE WEBSITE
router.delete("/:websiteId", authMiddleware, deleteWebsiteController);

// PAUSE WEBSITE
router.post("/:websiteId/pause", authMiddleware, pauseWebsiteController);

// RESUME WEBSITE
router.post("/:websiteId/resume", authMiddleware, resumeWebsiteController);

export default router;
