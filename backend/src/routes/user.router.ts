import { Router } from "express";
import { changePassword, login, signUp, updateUser } from "../controllers/user.controllers";
import multerMiddleware from "../middlewares/multer.middlerware";
import addUser from "../middlewares/addUser.middleware";
import userAuth from "../middlewares/userAuth.middleware";

const router = Router()

// Sign up route
router.post('/signup', multerMiddleware.single('avatar'), signUp)

// Login route
router.post('/login', addUser, login)

// Secured routes

// update user
router.put('/update', userAuth, updateUser)

// change avatar
router.put('/change-avatar', userAuth, multerMiddleware.single('avatar'), updateUser)

// change password 

router.put("/change-password", userAuth, changePassword)

export default router