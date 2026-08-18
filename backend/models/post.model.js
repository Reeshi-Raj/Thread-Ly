import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
	{
		isDeleted:{
			type:Boolean,
			default:false,
		},
		
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		text: {
			type: String,
			trim: true,
			maxlength: 500,
			default: "",
		},

		image: {
			url: {
				type: String,
				default: "",
			},
			publicId: {
				type: String,
				default: "",
			},
		},

		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],

		comments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Comment",
			},
		],
	},
	{
		timestamps: true,
	}
);

const Post = mongoose.model("Post", postSchema);

export default Post;