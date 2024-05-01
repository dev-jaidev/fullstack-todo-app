"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    constructor(statusCode, data, message) {
        this.success = statusCode >= 200 && statusCode < 300;
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
    }
}
exports.ApiResponse = ApiResponse;
