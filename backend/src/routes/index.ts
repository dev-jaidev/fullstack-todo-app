import { Router } from "express";
import userRouter from "./user.router";
import todoRouter from "./todo.router";
import folderRouter from "./folder.router";

const router = Router()

// user router
router.use("/user", userRouter);
// todo router
router.use("/todo", todoRouter);
// folder router
router.use("/folder", folderRouter);

export default router;