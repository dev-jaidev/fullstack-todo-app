import { Router } from "express";
import { signUp } from "../controllers/user.controllers";
import multerMiddleware from "../middlewares/multer.middlerware";

const router = Router()

// Sign up route
router.post('/signup', multerMiddleware.single('avatar'), signUp)

export default router