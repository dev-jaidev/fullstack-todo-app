"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const todo_controllers_1 = require("../controllers/todo.controllers");
const userAuth_middleware_1 = __importDefault(require("../middlewares/userAuth.middleware"));
const router = (0, express_1.Router)();
// create todo
router.post('/create', userAuth_middleware_1.default, todo_controllers_1.createTodo);
// update todo
router.put('/update', userAuth_middleware_1.default, todo_controllers_1.updateTodo);
// delete todo 
router.delete('/delete', userAuth_middleware_1.default, todo_controllers_1.deleteTodo);
// toggle todo
router.put('/toggle', userAuth_middleware_1.default, todo_controllers_1.toggleIsCompleted);
// get todos
router.get('/get', userAuth_middleware_1.default, todo_controllers_1.getTodos);
// pin todo
router.put('/pin', userAuth_middleware_1.default, todo_controllers_1.toggleIsPinned);
// get tags
router.get('/tags', userAuth_middleware_1.default, todo_controllers_1.getAllTags);
exports.default = router;
