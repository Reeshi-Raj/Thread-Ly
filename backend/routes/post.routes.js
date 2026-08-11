import express from "express";
import { createPost,getFeed,getUserPosts,deletePost} from "../controllers/post.controller.js";
import protectRoute from "../middlewares/protectRoute.js";
import upload from "../config/multer.js";

const router = express.Router();

router.post("/create",protectRoute,upload.single("image"),createPost);
router.get("/feed",protectRoute,getFeed);
router.get("/user/:username",getUserPosts);
router.delete("/:id",protectRoute,deletePost);


export default router;