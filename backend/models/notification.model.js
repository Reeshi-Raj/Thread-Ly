import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
	{
		// User who receives the notification
		recipient: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		// User who performed the action
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		type: {
			type: String,
			enum: ["FOLLOW", "LIKE", "COMMENT", "REPLY"],
			required: true,
		},

		// Target post, if applicable
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
			default: null,
		},

		// Target comment/reply, if applicable
		comment: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment",
			default: null,
		},

		isRead: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

const Notification = mongoose.model(
	"Notification",
	notificationSchema
);

export default Notification;