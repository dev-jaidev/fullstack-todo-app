import { Router } from "express";
import { login, signUp } from "../controllers/user.controllers";
import multerMiddleware from "../middlewares/multer.middlerware";

const router = Router()

// Sign up route
router.post('/signup', multerMiddleware.single('avatar'), signUp)
router.post('/login', login)

export default router