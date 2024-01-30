import { Router } from "express";
import { createTodo, getTodos, toggleIsCompleted, updateTodo } from "../controllers/todo.controllers";
import userAuth from "../middlewares/userAuth.middleware";

const router = Router()

// create todo
router.post('/create', userAuth, createTodo)

// update todo
router.put('/update', userAuth, updateTodo)

// toggle todo
router.put('/toggle', userAuth, toggleIsCompleted)

// get todos
router.get('/get', userAuth, getTodos)

export default router;