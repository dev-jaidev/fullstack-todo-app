import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiResponse";

const helloFromUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const resp = new ApiResponse(200, {}, "Hello from user")
    res.status(200).send(resp);
    return 
  }
);

export { helloFromUser };
