import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
			required: true,
		},

		parentComment: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment",
			default: null,
		},

		text: {
			type: String,
			required: true,
			trim: true,
			maxlength: 500,
		},

		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],

		repliesCount: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;