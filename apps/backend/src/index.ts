import dotenv from "dotenv";
dotenv.config();

// Workspace fallback for database and redis env
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: "../../packages/db/.env" });
}
if (!process.env.REDIS_URL) {
  dotenv.config({ path: "../tests/.env" });
}

import express from "express";
import type { ErrorRequestHandler } from "express";
import cookieParser from "cookie-parser";
import authRouter from "./auth/auth.routes.js";
import regionRouter from "./region/region.routes.js";
import websiteRouter from "./website/website.routes.js";
import statusPageRouter from "./status-page/status-page.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRouter);
app.use("/api/regions", regionRouter);
app.use("/api/websites", websiteRouter);
app.use("/api/status-pages", statusPageRouter);

const handleJsonErrors: ErrorRequestHandler = (error, _req, res, next) => {
  if (
    error instanceof SyntaxError &&
    "status" in error &&
    error.status === 400 &&
    "type" in error &&
    error.type === "entity.parse.failed"
  ) {
    return res.status(400).json({ success: false, message: "Invalid JSON request body." });
  }

  return next(error);
};

const generalErrorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error("[Watchtower Backend Error]:", error);
  return res.status(500).json({
    success: false,
    message: error instanceof Error ? error.message : "Internal Server Error",
  });
};

app.use(handleJsonErrors);
app.use(generalErrorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
