import mongoose from "mongoose";
import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import { createNotification } from "../utils/createNotification.js";

export const createComment = async (req, res) => {
	const session = await mongoose.startSession();

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
		const post = await Post.findById(postId).session(session);

		if (!post) {
			return res.status(404).json({
				success: false,
				message: "Post not found",
			});
		}

		// If parentComment is provided, validate it
		let parent =null;
		if (parentComment) {
			if (!mongoose.Types.ObjectId.isValid(parentComment)) {
				return res.status(400).json({
					success: false,
					message: "Invalid parent comment ID",
				});
			}

			parent = await Comment.findById(parentComment).session(session);

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
			if (parent.parentComment) {
				return res.status(400).json({
					success: false,
					message: "Replies cannot have replies",
				});
			}
		}

		let comment;
		await session.withTransaction(async () => {
			comment = await Comment.create(
				[
					{
						user: req.user._id,
						post: postId,
						parentComment: parentComment || null,
						text: text.trim(),
					},
				],
				{ session }
			);

			comment = comment[0];

			await Post.findByIdAndUpdate(
				postId,
				{ $push: { comments: comment._id } },
				{ session, returnDocument: "after" }
			);

			if (parentComment) {
				await Comment.findByIdAndUpdate(
					parentComment,
					{ $inc: { repliesCount: 1 } },
					{ session, returnDocument: "after" }
				);

				await createNotification({
					recipient: parent.user,
					sender: req.user._id,
					type: "REPLY",
					post: postId,
					comment: comment._id,
				});
			} else {
				await createNotification({
					recipient: post.user,
					sender: req.user._id,
					type: "COMMENT",
					post: postId,
					comment: comment._id,
				});
			}
		});

		const populatedComment = await Comment.findById(comment._id)
			.populate("user", "name username profilePic.url")
			.session(session);

		const commentPayload = populatedComment.toObject();
		commentPayload.isLiked = false;

		return res.status(201).json({
			success: true,
			message: parentComment
				? "Reply added successfully"
				: "Comment added successfully",
			comment: commentPayload,
		});
	} catch (error) {
		console.error("Create Comment Error:", error.message);

		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	} finally {
		await session.endSession();
	}
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

		const userId = req.user?._id?.toString();
		const commentsWithLikeState = comments.map((comment) => ({
			...comment.toObject(),
			isLiked: comment.likes.some(
				(id) => id.toString() === userId
			),
		}));

		const totalPages = Math.ceil(totalComments / limit);

		return res.status(200).json({
			success: true,
			comments: commentsWithLikeState,
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
		const userId = req.user?._id?.toString();
		const repliesWithLikeState = replies.map((reply) => ({
			...reply.toObject(),
			isLiked: reply.likes.some(
				(id) => id.toString() === userId
			),
		}));

		return res.status(200).json({
			success: true,
			replies: repliesWithLikeState,
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

		if (!alreadyLiked) {
			await createNotification({
				recipient: comment.user,
				sender: userId,
				type: "LIKE",
				post: comment.post,
				comment: comment._id,
			});
		}

		return res.status(200).json({
			success: true,
			message: alreadyLiked
				? "Comment unliked successfully"
				: "Comment liked successfully",
			isLiked: !alreadyLiked,
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

		if (comment.parentComment) {
			await Comment.findByIdAndDelete(commentId, { session });
			await Post.findByIdAndUpdate(
				comment.post,
				{ $pull: { comments: commentId } },
				{ session }
			);
			await Comment.findByIdAndUpdate(
				comment.parentComment,
				{ $inc: { repliesCount: -1 } },
				{ session }
			);

			await session.commitTransaction();

			return res.status(200).json({
				success: true,
				message: "Reply deleted successfully",
			});
		}

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


