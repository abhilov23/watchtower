import { Router } from "express";
import {
  getStatusPagesController,
  getStatusPageByIdController,
  createStatusPageController,
  updateStatusPageController,
  deleteStatusPageController,
  getPublicStatusPageController,
} from "./status-page.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// Public status page (no session required)
router.get("/public/:slug", getPublicStatusPageController);

// Authenticated status page management
router.get("/", authMiddleware, getStatusPagesController);
router.post("/", authMiddleware, createStatusPageController);
router.get("/:statusPageId", authMiddleware, getStatusPageByIdController);
router.patch("/:statusPageId", authMiddleware, updateStatusPageController);
router.delete("/:statusPageId", authMiddleware, deleteStatusPageController);

export default router;
