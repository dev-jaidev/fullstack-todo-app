import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../utils/apiResponse";

const handleError = (err: any, req:Request, res:Response, next: NextFunction): void=>{
    console.error(err)
    res.status(500).send(new ApiResponse(500, {}, "internal server error"))
    return
}

export default handleError