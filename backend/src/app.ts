import cookieParser from "cookie-parser";
import express from "express";
import userRouter from "./routes/user.router";
import connectDB from "./middlewares/connetToDb.middleware";
import handleError from "./middlewares/errorHandle.middleware";

const app = express();
app.use(connectDB);
app.use(cookieParser());
app.use(express.json());

// user router
app.use("/user", userRouter);

// global error handle
app.use(handleError)
export default app;
