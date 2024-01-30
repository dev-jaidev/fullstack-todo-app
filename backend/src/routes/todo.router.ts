import { Router } from "express";
import { getTodos } from "../controllers/todo.controllers";
import userAuth from "../middlewares/userAuth.middleware";

const router = Router()

router.get('/get-todos', userAuth, getTodos)

export default router;