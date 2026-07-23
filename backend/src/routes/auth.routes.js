import { Router } from "express";
import { googleAuth, loggedInUser, logout, refreshToken } from "../controllers/auth.controller.js"
import { userAuth } from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/google", googleAuth)
router.post("/refresh", refreshToken)
router.post("/refresh-token", refreshToken)
router.post("/logout", logout)
router.get("/user", userAuth, loggedInUser)
router.get("/me", userAuth, loggedInUser)


export default router;