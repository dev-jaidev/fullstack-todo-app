"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_router_1 = __importDefault(require("./user.router"));
const todo_router_1 = __importDefault(require("./todo.router"));
const folder_router_1 = __importDefault(require("./folder.router"));
const router = (0, express_1.Router)();
// user router
router.use("/user", user_router_1.default);
// todo router
router.use("/todo", todo_router_1.default);
// folder router
router.use("/folder", folder_router_1.default);
exports.default = router;
