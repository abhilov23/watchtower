import { Request, Response } from "express";

import {
    createWebsite,
    getWebsites,
    getWebsiteById,
    updateWebsite,
    deleteWebsite,
    pauseWebsite,
    resumeWebsite
} from "./website.service.js";

interface WebsiteParams {
    websiteId: string;
}


// CREATE WEBSITE CONTROLLER
export async function createWebsiteController(
    req: Request,
    res: Response
) {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const website = await createWebsite(
            userId,
            req.body
        );

        return res.status(201).json({
            success: true,
            data: website
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to create website"
        });
    }
}


// GET ALL WEBSITES CONTROLLER
export async function getWebsitesController(
    req: Request,
    res: Response
) {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const websites = await getWebsites(userId);

        return res.status(200).json({
            success: true,
            data: websites
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to fetch websites"
        });
    }
}


// GET WEBSITE BY ID CONTROLLER
export async function getWebsiteByIdController(
    req: Request<WebsiteParams>,
    res: Response
) {
    try {
        const userId = req.userId;
        const websiteId = req.params.websiteId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const website = await getWebsiteById(
            userId,
            websiteId
        );

        return res.status(200).json({
            success: true,
            data: website
        });

    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Website not found"
        });
    }
}


// UPDATE WEBSITE CONTROLLER
export async function updateWebsiteController(
    req: Request<WebsiteParams>,
    res: Response
) {
    try {
        const userId = req.userId;
        const websiteId = req.params.websiteId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const website = await updateWebsite(
            userId,
            websiteId,
            req.body
        );

        return res.status(200).json({
            success: true,
            data: website
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to update website"
        });
    }
}


// DELETE WEBSITE CONTROLLER
export async function deleteWebsiteController(
    req: Request<WebsiteParams>,
    res: Response
) {
    try {
        const userId = req.userId;
        const websiteId = req.params.websiteId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const result = await deleteWebsite(
            userId,
            websiteId
        );

        return res.status(200).json({
            success: true,
            ...result
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to delete website"
        });
    }
}


// PAUSE WEBSITE CONTROLLER
export async function pauseWebsiteController(
    req: Request<WebsiteParams>,
    res: Response
) {
    try {
        const userId = req.userId;
        const websiteId = req.params.websiteId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const website = await pauseWebsite(
            userId,
            websiteId
        );

        return res.status(200).json({
            success: true,
            data: website
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to pause website"
        });
    }
}


// RESUME WEBSITE CONTROLLER
export async function resumeWebsiteController(
    req: Request<WebsiteParams>,
    res: Response
) {
    try {
        const userId = req.userId;
        const websiteId = req.params.websiteId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const website = await resumeWebsite(
            userId,
            websiteId
        );

        return res.status(200).json({
            success: true,
            data: website
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to resume website"
        });
    }
}