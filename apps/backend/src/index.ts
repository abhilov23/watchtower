import express from "express";
import userRouter from "../users";
import {prismaClient} from "@watchtower/db";


const app = express();

app.use("/users", userRouter);


app.get("/", (req, res)=>{
    res.redirect("/users");
})

app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
});