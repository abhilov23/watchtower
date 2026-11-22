import {Request, Response, NextFunction} from "express";
import { validateSession } from "../auth/auth.service.js";

export async function authMiddleware(req: Request, res : Response, next : NextFunction){
   
    const sessionId = req.cookies?.sessionId;

    if(!sessionId){
        return res.status(401).json({
            message : "Unauthorized"
        })
    }

    const userId = await validateSession(sessionId);

    if(!userId){
        return res.status(401).json({
            message : "InvalidSession"
        });
    }

    req.userId = userId;

    next();
}