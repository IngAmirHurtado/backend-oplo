import { Router } from "express";
import { signup, login, logout, checkAuth } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/validateToken.js";

const router = Router();

router.post('/signup', signup)
router.post('/login', login)
router.get('/logout', logout)

router.get('/check', protectRoute, checkAuth )


export default router;