import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},

		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},

		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},

		password: {
			type: String,
			required: true,
		},

		profilePic: {
			url: {
				type: String,
				default: "",
			},
			publicId: {
				type: String,
				default: "",
			},
		},

		bio: {
			type: String,
			default: "",
		},

		followers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],

		following: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],

		isFrozen: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model("User", userSchema);

export default User;