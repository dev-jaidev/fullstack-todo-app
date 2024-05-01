"use strict";
// add user to req object
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const addUserFunc = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const authToken = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken) || ((_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[1]);
    if (!authToken) {
        return;
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret)
        throw new Error("jwtSecret is not defined");
    try {
        const user = jsonwebtoken_1.default.verify(authToken, jwtSecret);
        if (!user)
            return;
        req.user = JSON.parse(JSON.stringify(user));
        return;
    }
    catch (error) {
        return;
    }
});
exports.default = addUserFunc;
