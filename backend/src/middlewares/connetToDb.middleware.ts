import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";
import { NextFunction, Request, Response } from "express";

const connectDbMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (mongoose.connections[0].readyState) {
      // Use current db connection
      next();
      return;
    }

    // Use new db connection
    await mongoose.connect(
      process.env.MONGO_URI + "/" + process.env.DB_NAME || ""
    );
    next();
    console.log("Connected to DB successfully");
    return;
  }
);
export default connectDbMiddleware;
