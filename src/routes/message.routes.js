import { Router } from "express";

import { protectRoute } from "../middlewares/validateToken.js";

import { getMessages, sendMessage, usersWithChat } from "../controllers/message.controller.js";



const router = Router();

router.get("/get/:id", protectRoute, getMessages);
router.post("/send/:receivedId", protectRoute, sendMessage);
router.get("/users-with-chat", protectRoute, usersWithChat);


export default router;