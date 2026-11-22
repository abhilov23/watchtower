import { Request, Response } from "express";
import { createWebsite } from "./website.service.js";

export async function createWebsiteController( req: Request,  res: Response
) {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
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