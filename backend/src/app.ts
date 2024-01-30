import cookieParser from "cookie-parser";
import express from "express";
import userRouter from "./routes/user.router";
import connectDB from "./middlewares/connetToDb.middleware";
import handleError from "./middlewares/errorHandle.middleware";
import cors from "cors";
import todoRouter from "./routes/todo.router";

const app = express();

app.use(connectDB);
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// user router
app.use("/api/v1/user", userRouter);

// todo router
app.use("/api/v1/todo", todoRouter);

// global error handle
app.use(handleError)
export default app;
