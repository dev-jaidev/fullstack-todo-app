import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import  addUserFunc from "../utils/addUser";




const addUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    await addUserFunc(req);
    next()
  }
);
