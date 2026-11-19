import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./auth/auth.routes";

app.use("/api/auth", authRouter);

const app = express();

app.use(cookieParser());
app.use("/api/auth", authRouter);



app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
});