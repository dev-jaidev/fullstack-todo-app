import cookieParser from "cookie-parser";
import express from "express";
import userRouter from "./routes/user.router";
import connectDB from "./middlewares/connetToDb.middleware";
import handleError from "./middlewares/errorHandle.middleware";
import cors from "cors";

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
app.use("/user", userRouter);

// global error handle
app.use(handleError)
export default app;
