import express from "express";
import { signupUser, loginUser ,logoutUser,getMe,getUserProfile,updateProfile,followUser,unfollowUser} from "../controllers/user.controller.js";
import protectRoute from "../middlewares/protectRoute.js";
import upload from "../config/multer.js";


const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protectRoute, getMe);
router.get("/profile/:username", getUserProfile);
router.put("/update",protectRoute,upload.single("profilePic"),updateProfile);
router.post("/follow/:id",protectRoute,followUser); // testing baki
router.post("/unfollow/:id",protectRoute,unfollowUser); // testing baki

export default router;