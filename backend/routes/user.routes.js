import express from "express";
import { signupUser, loginUser ,logoutUser,getMe,getUserProfile,updateProfile} from "../controllers/user.controller.js";
import protectRoute from "../middlewares/protectRoute.js";
import upload from "../config/multer.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protectRoute, getMe);
router.get("/profile/:username", getUserProfile);
router.put(
	"/update",
	protectRoute,
	upload.single("profilePic"),
	updateProfile
);
export default router;