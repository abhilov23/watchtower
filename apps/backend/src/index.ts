import express from "express";
import type { ErrorRequestHandler } from "express";
import cookieParser from "cookie-parser";
//import authRouter from "./auth/auth.routes";
import authRouter from "./auth/auth.routes.js";
import websiteRouter from "./website/website.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/websites", websiteRouter);

const handleJsonErrors: ErrorRequestHandler = (error, _req, res, next) => {
  if (
    error instanceof SyntaxError &&
    "status" in error &&
    error.status === 400 &&
    "type" in error &&
    error.type === "entity.parse.failed"
  ) {
    return res.status(400).json({ message: "Invalid JSON request body." });
  }

  return next(error);
};

app.use(handleJsonErrors);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
