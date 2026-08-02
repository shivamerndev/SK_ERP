import { Router } from "express";
import { register, login, loggedInUser, logout, refreshToken } from "../controllers/auth.controller.js"
import { userAuth } from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/register", register)
router.post("/login", login)
router.post("/refresh", refreshToken)
router.post("/refresh-token", refreshToken)
router.post("/logout", logout)
router.get("/user", userAuth, loggedInUser)
router.get("/me", userAuth, loggedInUser)


export default router;