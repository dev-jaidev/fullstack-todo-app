import { Router } from "express";
import {  login, signUp, updateUser, changePassword, updateAvatar   } from "../controllers/user.controllers";
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
router.put('/update-avatar', userAuth, multerMiddleware.single('avatar'), updateAvatar)

// change password 

router.put("/update-password", userAuth, changePassword)

export default router