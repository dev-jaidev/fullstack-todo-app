import { Router } from "express";
import { createTodo, deleteTodo, getTodos, toggleIsCompleted, updateTodo } from "../controllers/todo.controllers";
import userAuth from "../middlewares/userAuth.middleware";

const router = Router()

// create todo
router.post('/create', userAuth, createTodo)

// update todo
router.put('/update', userAuth, updateTodo)

// delete todo 
router.delete('/delete', userAuth, deleteTodo)

// toggle todo
router.put('/toggle', userAuth, toggleIsCompleted)

// get todos
router.get('/get', userAuth, getTodos)

export default router;