import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../utils/apiResponse";
import multer from "multer";

const handleError = (err: any, req: Request, res: Response, next: NextFunction): void => {
    console.error(err);
    if (err instanceof multer.MulterError) {
        const statusCode = err.code === 'LIMIT_FILE_SIZE' ? 413 : 415;
        const message = err.code === 'LIMIT_FILE_SIZE' ? "File can't be larger than 5MB" : err.field || 'Invalid file';
        res.status(statusCode).send(new ApiResponse(statusCode, {}, message));
    }
        res.status(500).send(new ApiResponse(500, {}, "Internal server error"));
        return
}

export default handleError