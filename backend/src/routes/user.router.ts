import { Request, Response, Router } from "express";
import { helloFromUser } from "../controllers/user.controllers";

const router = Router()

router.get('/', helloFromUser )

export default router