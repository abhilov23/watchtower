import { Request, Response } from "express";
import {
  getStatusPages,
  getStatusPageById,
  createStatusPage,
  updateStatusPage,
  deleteStatusPage,
  getPublicStatusPage,
} from "./status-page.service.js";

interface StatusPageParams extends Record<string, string> {
  statusPageId: string;
}

export async function getStatusPagesController(req: Request, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const pages = await getStatusPages(userId);
    return res.status(200).json({ success: true, data: pages });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch status pages",
    });
  }
}

export async function getStatusPageByIdController(
  req: Request<StatusPageParams>,
  res: Response
) {
  try {
    const userId = req.userId;
    const { statusPageId } = req.params;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const page = await getStatusPageById(userId, statusPageId);
    return res.status(200).json({ success: true, data: page });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : "Status page not found",
    });
  }
}

export async function createStatusPageController(req: Request, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const page = await createStatusPage(userId, req.body);
    return res.status(201).json({ success: true, data: page });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to create status page",
    });
  }
}

export async function updateStatusPageController(
  req: Request<StatusPageParams>,
  res: Response
) {
  try {
    const userId = req.userId;
    const { statusPageId } = req.params;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const updated = await updateStatusPage(userId, statusPageId, req.body);
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to update status page",
    });
  }
}

export async function deleteStatusPageController(
  req: Request<StatusPageParams>,
  res: Response
) {
  try {
    const userId = req.userId;
    const { statusPageId } = req.params;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const result = await deleteStatusPage(userId, statusPageId);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete status page",
    });
  }
}

export async function getPublicStatusPageController(
  req: Request<{ slug: string }>,
  res: Response
) {
  try {
    const { slug } = req.params;
    const data = await getPublicStatusPage(slug);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : "Public status page not found",
    });
  }
}
