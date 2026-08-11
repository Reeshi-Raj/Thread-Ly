import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";

export const createPost = async (req, res) => {
	let uploadedImage = null;

	try {
		const { text } = req.body;

		// A post must contain either text or an image
		if (!text?.trim() && !req.file) {
			return res.status(400).json({
				success: false,
				message: "Post must contain text or an image",
			});
		}

		// Upload image if provided
		if (req.file) {
			uploadedImage = await uploadToCloudinary(
				req.file.buffer,
				"threadshub/posts"
			);
		}

		// Create post in MongoDB
		const post = await Post.create({
			user: req.user._id,
			text: text?.trim() || "",
			image: req.file
				? {
						url: uploadedImage.secure_url,
						publicId: uploadedImage.public_id,
				  }
				: {
						url: "",
						publicId: "",
				  },
		});

		return res.status(201).json({
			success: true,
			message: "Post created successfully",
			post,
		});
	} catch (error) {
		console.error("Create Post Error:", error.message);

		// Cleanup Cloudinary image if MongoDB operation failed
		if (uploadedImage?.public_id) {
			try {
				await deleteFromCloudinary(
					uploadedImage.public_id
				);
			} catch (deleteError) {
				console.error(
					"Failed to cleanup Cloudinary image:",
					deleteError.message
				);
			}
		}

		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
};
export const getFeed = async (req, res) => {
	try {
		const page = Math.max(parseInt(req.query.page) || 1, 1);
		const limit = Math.min(
			Math.max(parseInt(req.query.limit) || 10, 1),
			50
		);

		const skip = (page - 1) * limit;
        
        // currentUser ke following list ko fetch karna
		const currentUser = await User.findById(req.user._id).select(
			"following"
		);

		if (!currentUser) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		// Include current user's own posts in the feed
		const userIds = [
			currentUser._id,
			...currentUser.following,
		];

		const posts = await Post.find({
			user: { $in: userIds },
		})
			.populate(
				"user",
				"name username profilePic.url"
			)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit);

		const totalPosts = await Post.countDocuments({
			user: { $in: userIds },
		});

		const hasMore = skip + posts.length < totalPosts;

		return res.status(200).json({
			success: true,
			posts,
			pagination: {
				page,
				limit,
				totalPosts,
				hasMore,
			},
		});
	} catch (error) {
		console.error("Get Feed Error:", error.message);

		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
};
export const getUserPosts = async (req, res) => {
	try {
		const { username } = req.params;

		const page = Math.max(parseInt(req.query.page) || 1, 1);
		const limit = Math.min(
			Math.max(parseInt(req.query.limit) || 10, 1),
			50
		);

		const skip = (page - 1) * limit;

		const user = await User.findOne({ username }).select("_id");

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		const posts = await Post.find({
			user: user._id,
		})
			.populate(
				"user",
				"name username profilePic.url"
			)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit);

		const totalPosts = await Post.countDocuments({
			user: user._id,
		});

		const hasMore = skip + posts.length < totalPosts;

		return res.status(200).json({
			success: true,
			posts,
			pagination: {
				page,
				limit,
				totalPosts,
				hasMore,
			},
		});
	} catch (error) {
		console.error("Get User Posts Error:", error.message);

		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
};
export const deletePost = async (req, res) => {
	try {
		const { id } = req.params;

		const post = await Post.findById(id);

		if (!post) {
			return res.status(404).json({
				success: false,
				message: "Post not found",
			});
		}

		// Only post owner can delete the post
		if (post.user.toString() !== req.user._id.toString()) {
			return res.status(403).json({
				success: false,
				message: "You are not authorized to delete this post",
			});
		}

		// Delete image from Cloudinary first
		if (post.image?.publicId) {
			try {
				await deleteFromCloudinary(post.image.publicId);
			} catch (cloudinaryError) {
				console.error(
					"Cloudinary Delete Error:",
					cloudinaryError.message
				);

				return res.status(500).json({
					success: false,
					message: "Failed to delete post image",
				});
			}
		}

		// Delete post from MongoDB
		await Post.findByIdAndDelete(id);

		return res.status(200).json({
			success: true,
			message: "Post deleted successfully",
		});
	} catch (error) {
		console.error("Delete Post Error:", error.message);

		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
        // one issue may occur that Cloudinary se img delete ho gyi but mongoDB se deletion fail kr gya 
        // in that case we can not have image in cloudinary but post rhega in DB
        // that is one issue in here. CAN'T USE TRANSACTION with cloudinary 
	}
};
export const toggleLike = async (req, res) => {
	try {
		const { id } = req.params;

		const post = await Post.findById(id);

		if (!post) {
			return res.status(404).json({
				success: false,
				message: "Post not found",
			});
		}

		const userId = req.user._id;

		const alreadyLiked = post.likes.some(
			(id) => id.toString() === userId.toString()
		);

		if (alreadyLiked) {
			post.likes = post.likes.filter(
				(id) => id.toString() !== userId.toString()
			);
		} else {
			post.likes.push(userId);
		}

		await post.save();

		return res.status(200).json({
			success: true,
			message: alreadyLiked
				? "Post unliked successfully"
				: "Post liked successfully",
			liked: !alreadyLiked,
			likesCount: post.likes.length,
		});
	} catch (error) {
		console.error("Toggle Like Error:", error.message);

		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
};