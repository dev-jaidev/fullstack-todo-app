// check if req.user exists if not send unauthorised in reqonse

import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiResponse";
import addUserFunc from "../utils/addUser";


const userAuth = asyncHandler(

    async (req: Request, res: Response, next: NextFunction) => {
        await addUserFunc(req);
        if (!req.user) {
            res.status(401).send(new ApiResponse(401, {}, "unauthorized"));
            return;
        }
        next();
    }
);

export default userAuth;