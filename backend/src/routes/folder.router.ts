import { Router } from "express";
import { createFolder, deleteFolder, getFolders, updateFolder } from "../controllers/folder.controllers";
import userAuth from "../middlewares/userAuth.middleware";

const router = Router()

// create folder route
router.post('/create', userAuth, createFolder)

// update folder
router.put('/update', userAuth, updateFolder)

// delete folder
router.delete('/delete', userAuth, deleteFolder)

// get folder
router.get('/get', userAuth, getFolders)

export default router;