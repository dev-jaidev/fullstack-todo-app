import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiResponse";

// sign up controller

const signUp = asyncHandler(async (req: Request, res: Response) => {
  console.log( req.body , req.file)
  res.send(new ApiResponse(200, {}, "success"));
});

export { 
  signUp
 }
