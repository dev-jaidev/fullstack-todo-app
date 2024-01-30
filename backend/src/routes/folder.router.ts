import { Router } from "express";
import { createFolder, getFolders } from "../controllers/folder.controllers";
import userAuth from "../middlewares/userAuth.middleware";

const router = Router()

// create folder route
router.post('/create', userAuth, createFolder)

// get folder
router.get('/get', userAuth, getFolders)

export default router;