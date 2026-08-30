import Notification from "../models/notification.model.js";

export const createNotification = async ({
	recipient,
	sender,
	type,
	post = null,
	comment = null,
}) => {
	// Don't notify user about their own action
	if (recipient.toString() === sender.toString()) {
		return null;
	}

	const notification = await Notification.create({
		recipient,
		sender,
		type,
		post,
		comment,
	});

	return notification;
};