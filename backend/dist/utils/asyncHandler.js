"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
const apiResponse_1 = require("./apiResponse");
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => {
            res.status(500).send(new apiResponse_1.ApiResponse(500, {}, "internal server error"));
            console.error(err);
        });
        return;
    };
};
exports.asyncHandler = asyncHandler;
