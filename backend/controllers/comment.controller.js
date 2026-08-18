import mongoose from "mongoose";
import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";

export const createComment = async (req, res) => {
	try {
		const { postId } = req.params;
		const { text, parentComment } = req.body;

		// Validate Post ID
		if (!mongoose.Types.ObjectId.isValid(postId)) {
			return res.status(400).json({
				success: false,
				message: "Invalid post ID",
			});
		}

		// Validate comment text
		if (!text?.trim()) {
			return res.status(400).json({
				success: false,
				message: "Comment text is required",
			});
		}

		// Check whether post exists
		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({
				success: false,
				message: "Post not found",
			});
		}

		// If parentComment is provided, validate it
		if (parentComment) {
			if (!mongoose.Types.ObjectId.isValid(parentComment)) {
				return res.status(400).json({
					success: false,
					message: "Invalid parent comment ID",
				});
			}

			const parent = await Comment.findById(parentComment);

			if (!parent) {
				return res.status(404).json({
					success: false,
					message: "Parent comment not found",
				});
			}

			// Parent comment must belong to the same post
			if (parent.post.toString() !== postId) {
				return res.status(400).json({
					success: false,
					message: "Parent comment does not belong to this post",
				});
			}
		}

		// Create comment
		const comment = await Comment.create({
			user: req.user._id,
			post: postId,
			parentComment: parentComment || null,
			text: text.trim(),
		});

		// Add comment ID to Post
		post.comments.push(comment._id);
		await post.save();

		// If this is a reply, increment parent's replies count
		if (parentComment) {
			await Comment.findByIdAndUpdate(parentComment, {
				$inc: {
					repliesCount: 1,
				},
			});
		}

		const populatedComment = await Comment.findById(comment._id).populate(
			"user",
			"name username profilePic.url"
		);

		return res.status(201).json({
			success: true,
			message: parentComment
				? "Reply added successfully"
				: "Comment added successfully",
			comment: populatedComment,
		});
	} catch (error) {
		console.error("Create Comment Error:", error.message);

		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
    // currently updating three documents during reply creation:
 //Create Comment
       //↓
 // Post.comments.push()
       //↓
 //ParentComment.repliesCount++
//This is another consistency issue similar to the Cloudinary.
// these all are mongoDB transactions so we can use transactions to ensure that either all three operations succeed or none of them do. This will help maintain data integrity and prevent orphaned comments or incorrect counts.
};
export const getPostComments = async (req, res) => {
	try {
		const { postId } = req.params;

		const page = Math.max(parseInt(req.query.page) || 1, 1);
		const limit = Math.min(
			Math.max(parseInt(req.query.limit) || 10, 1),
			50
		);

		if (!mongoose.Types.ObjectId.isValid(postId)) {
			return res.status(400).json({
				success: false,
				message: "Invalid post ID",
			});
		}

		const postExists = await Post.exists({ _id: postId });

		if (!postExists) {
			return res.status(404).json({
				success: false,
				message: "Post not found",
			});
		}

		const skip = (page - 1) * limit;

		const [comments, totalComments] = await Promise.all([
			Comment.find({
				post: postId,
				parentComment: null,
			})
				.populate("user", "name username profilePic")
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit),

			Comment.countDocuments({
				post: postId,
				parentComment: null,
			}),
		]);

		const totalPages = Math.ceil(totalComments / limit);

		return res.status(200).json({
			success: true,
			comments,
			pagination: {
				currentPage: page,
				limit,
				totalComments,
				totalPages,
				hasNextPage: page < totalPages,
			},
		});
	} catch (error) {
		console.error("Get Post Comments Error:", error.message);

		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
};
export const getCommentReplies = async (req, res) => {
	try {
		const { commentId } = req.params;

		const page = Math.max(parseInt(req.query.page) || 1, 1);
		const limit = Math.min(
			Math.max(parseInt(req.query.limit) || 10, 1),
			50
		);

		if (!mongoose.Types.ObjectId.isValid(commentId)) {
			return res.status(400).json({
				success: false,
				message: "Invalid comment ID",
			});
		}

		const parentComment = await Comment.findById(commentId);

		if (!parentComment) {
			return res.status(404).json({
				success: false,
				message: "Comment not found",
			});
		}

		const skip = (page - 1) * limit;

		const [replies, totalReplies] = await Promise.all([
			Comment.find({
				parentComment: commentId,
			})
				.populate("user", "name username profilePic")
				.sort({ createdAt: 1 })
				.skip(skip)
				.limit(limit),

			Comment.countDocuments({
				parentComment: commentId,
			}),
		]);

		const totalPages = Math.ceil(totalReplies / limit);

		return res.status(200).json({
			success: true,
			replies,
			pagination: {
				currentPage: page,
				limit,
				totalReplies,
				totalPages,
				hasNextPage: page < totalPages,
			},
		});
	} catch (error) {
		console.error("Get Comment Replies Error:", error.message);

		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
};
export const toggleCommentLike = async (req, res) => {
	try {
		const { commentId } = req.params;

		if (!mongoose.Types.ObjectId.isValid(commentId)) {
			return res.status(400).json({
				success: false,
				message: "Invalid comment ID",
			});
		}

		const comment = await Comment.findById(commentId);

		if (!comment) {
			return res.status(404).json({
				success: false,
				message: "Comment not found",
			});
		}

		const userId = req.user._id;

		const alreadyLiked = comment.likes.some(
			(id) => id.toString() === userId.toString()
		);

		if (alreadyLiked) {
			comment.likes = comment.likes.filter(
				(id) => id.toString() !== userId.toString()
			);
		} else {
			comment.likes.push(userId);
		}

		await comment.save();

		return res.status(200).json({
			success: true,
			message: alreadyLiked
				? "Comment unliked successfully"
				: "Comment liked successfully",
			liked: !alreadyLiked,
			likesCount: comment.likes.length,
		});
	} catch (error) {
		console.error("Toggle Comment Like Error:", error.message);

		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
};
export const deleteComment = async (req, res) => {
	const session = await mongoose.startSession();

	try {
		const { commentId } = req.params;

		if (!mongoose.Types.ObjectId.isValid(commentId)) {
			return res.status(400).json({
				success: false,
				message: "Invalid comment ID",
			});
		}

		session.startTransaction();

		const comment = await Comment.findById(commentId).session(
			session
		);

		if (!comment) {
			await session.abortTransaction();

			return res.status(404).json({
				success: false,
				message: "Comment not found",
			});
		}

		// Only comment owner can delete it
		if (
			comment.user.toString() !==
			req.user._id.toString()
		) {
			await session.abortTransaction();

			return res.status(403).json({
				success: false,
				message:
					"You are not authorized to delete this comment",
			});
		}

		// Soft delete the comment
		await Comment.findByIdAndUpdate(
			commentId,
			{
				$set: {
					isDeleted: true,
					text: "",
				},
			},
			{ session }
		);

		// If this is a reply, decrease parent's replies count
		if (comment.parentComment) {
			await Comment.findByIdAndUpdate(
				comment.parentComment,
				{
					$inc: {
						repliesCount: -1,
					},
				},
				{ session }
			);
		}

		await session.commitTransaction();

		return res.status(200).json({
			success: true,
			message: "Comment deleted successfully",
		});
	} catch (error) {
		await session.abortTransaction();

		console.error(
			"Delete Comment Error:",
			error.message
		);

		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	} finally {
		session.endSession();
	}
};


