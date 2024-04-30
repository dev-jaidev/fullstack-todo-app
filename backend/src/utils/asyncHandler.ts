import { NextFunction, Request, RequestHandler, Response } from "express";
import { ApiResponse } from "./apiResponse";

const asyncHandler = (requestHandler: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      res.status(500).send(new ApiResponse(500, {}, "internal server error"));
      console.error(err);
    });
    return;
  };
};

export { asyncHandler };
