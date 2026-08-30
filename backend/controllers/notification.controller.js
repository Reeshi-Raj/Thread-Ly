import mongoose from "mongoose";
import Notification from "../models/notification.model.js";


export const getNotifications = async (req, res) => {
	try {
		const page = Math.max(
			parseInt(req.query.page) || 1,
			1
		);

		const limit = Math.min(
			Math.max(parseInt(req.query.limit) || 20, 1),
			50
		);

		const skip = (page - 1) * limit;

		const [notifications, totalNotifications, unreadCount] =
			await Promise.all([
				Notification.find({
					recipient: req.user._id,
				})
					.populate(
						"sender",
						"name username profilePic.url"
					)
					.populate("post", "_id")
					.populate(
						"comment",
						"_id parentComment"
					)
					.sort({ createdAt: -1 })
					.skip(skip)
					.limit(limit),

				Notification.countDocuments({
					recipient: req.user._id,
				}),

				Notification.countDocuments({
					recipient: req.user._id,
					isRead: false,
				}),
			]);

		const hasMore =
			skip + notifications.length < totalNotifications;

		return res.status(200).json({
			success: true,
			notifications,
			unreadCount,
			pagination: {
				page,
				limit,
				totalNotifications,
				hasMore,
			},
		});
	} catch (error) {
		console.error(
			"Get Notifications Error:",
			error.message
		);

		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
};
export const markNotificationAsRead = async (req, res) => {
	try {
		const { notificationId } = req.params;

		if (
			!mongoose.Types.ObjectId.isValid(
				notificationId
			)
		) {
			return res.status(400).json({
				success: false,
				message: "Invalid notification ID",
			});
		}

		const notification =
			await Notification.findOneAndUpdate(
				{
					_id: notificationId,
					recipient: req.user._id,
				},
				{
					$set: {
						isRead: true,
					},
				},
				{
					new: true,
				}
			);

		if (!notification) {
			return res.status(404).json({
				success: false,
				message: "Notification not found",
			});
		}

		return res.status(200).json({
			success: true,
			message: "Notification marked as read",
			notification,
		});
	} catch (error) {
		console.error(
			"Mark Notification Read Error:",
			error.message
		);

		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
};
export const markAllNotificationsAsRead = async (req, res) => {
	try {
		await Notification.updateMany(
			{
				recipient: req.user._id,
				isRead: false,
			},
			{
				$set: {
					isRead: true,
				},
			}
		);

		return res.status(200).json({
			success: true,
			message: "All notifications marked as read",
		});
	} catch (error) {
		console.error(
			"Mark All Notifications Read Error:",
			error.message
		);

		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
};