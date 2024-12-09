import Router from "express";

import { updateProfilePic, updateGeneralInfo, randomSuggestion, getUserResults } from "../controllers/user.controller.js";

import { protectRoute } from "../middlewares/validateToken.js";

const router = Router();


router.get('/get-results/:search', protectRoute, getUserResults)
router.get('/get-random-suggestion', protectRoute, randomSuggestion)
router.put('/update-general-info', protectRoute, updateGeneralInfo)
router.put('/update-profile-pic', protectRoute, updateProfilePic)

export default router;