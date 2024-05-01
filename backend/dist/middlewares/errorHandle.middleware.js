"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiResponse_1 = require("../utils/apiResponse");
const multer_1 = __importDefault(require("multer"));
const handleError = (err, req, res, next) => {
    console.error(err);
    if (err instanceof multer_1.default.MulterError) {
        const statusCode = err.code === 'LIMIT_FILE_SIZE' ? 413 : 415;
        const message = err.code === 'LIMIT_FILE_SIZE' ? "File can't be larger than 5MB" : err.field || 'Invalid file';
        res.status(statusCode).send(new apiResponse_1.ApiResponse(statusCode, {}, message));
    }
    res.status(500).send(new apiResponse_1.ApiResponse(500, {}, "Internal server error"));
    return;
};
exports.default = handleError;
