import express from "express";
import { createComment, 
    getPostComments,
    getCommentReplies,
    toggleCommentLike,
    deleteComment
} from "../controllers/comment.controller.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/post/:postId",protectRoute,createComment);
router.get("/post/:postId", getPostComments);
router.get("/:commentId/replies", getCommentReplies);
router.post("/:commentId/like",protectRoute,toggleCommentLike);
router.delete("/:commentId",protectRoute,deleteComment);

export default router;