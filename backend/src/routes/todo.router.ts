import { Router } from "express";
import { createTodo, deleteTodo, getAllTags, getTodos, toggleIsCompleted, toggleIsPinned, updateTodo } from "../controllers/todo.controllers";
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

// pin todo
router.put('/pin', userAuth, toggleIsPinned)

// get tags
router.get('/tags', userAuth, getAllTags)

export default router;