import {Request, Response} from "express";
import { register, login, deleteSession } from "./auth.service.js";


export async function registerController( req: Request, res: Response) {
    const { email, username, password } = req.body;

    const result = await register(email, username, password);

    if (result !== "success") {
        return res.status(400).json({
            message: result
        });
    }

    return res.status(201).json({
        message: "user registered successfully"
    });
}


export async function loginController( req: Request, res: Response) {
    const { identifier, password } = req.body;

    const sessionId = await login(identifier, password);

    if (sessionId === "invalid credentials") {
        return res.status(401).json({
            message: "invalid credentials"
        });
    }

    res.cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
        message: "logged in successfully"
    });
}


export async function logoutController( req: Request, res: Response) {
    const sessionId = req.cookies?.sessionId;

    if (sessionId) {
        await deleteSession(sessionId);
    }

    res.clearCookie("sessionId");

    return res.status(200).json({
        message: "logged out successfully"
    });
}