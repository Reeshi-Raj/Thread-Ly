import { Link, useNavigate } from "react-router-dom";
import {
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { markNotificationAsRead } from "../services/notification.service";

const NotificationCard = ({ notification }) => {
	const sender = notification.sender;
	const navigate = useNavigate();

	const getMessage = () => {
		switch (notification.type) {
			case "FOLLOW":
				return "started following you";

			case "LIKE":
				if (notification.comment) {
					return "liked your comment";
				}

				return "liked your post";

			case "COMMENT":
				return "commented on your post";

			case "REPLY":
				return "replied to your comment";

			default:
				return "interacted with you";
		}
	};
    const queryClient = useQueryClient();

const readMutation = useMutation({
	mutationFn: () =>
		markNotificationAsRead(notification._id),

	onSuccess: () => {
        if (notification.isRead) return;

		queryClient.setQueryData(
			["notifications"],
			(oldData) => {
				if (!oldData) return oldData;

				return {
					...oldData,

					unreadCount: Math.max(
						oldData.unreadCount - 1,
						0
					),

					notifications:
						oldData.notifications.map((item) =>
							item._id === notification._id
								? {
										...item,
										isRead: true,
									}
								: item
						),
				};
			}
		);
	},
});

const handleNotificationClick = () => {
	if (!notification.isRead) {
		readMutation.mutate();
	}

	if (notification.type === "FOLLOW") {
		navigate(`/profile/${notification.sender?.username}`);
		return;
	}

	if (notification.post?._id) {
		const params = new URLSearchParams();
		params.set("post", notification.post._id);

		if (notification.comment?._id) {
			params.set("comment", notification.comment._id);
		}

		navigate(`/?${params.toString()}`);
		return;
	}

	navigate("/");
};

	return (
		<div
			className={`flex gap-3 border-b border-white/10 px-4 py-4 transition hover:bg-white/3 ${
				!notification.isRead
					? "bg-white/4"
					: ""
			}`}
		>
			{/* Avatar */}
			<Link
				to={`/profile/${sender?.username}`}
				onClick={(e) => e.stopPropagation()}
				className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-sm font-bold text-black"
			>
				{sender?.profilePic?.url ? (
					<img
						src={sender.profilePic.url}
						alt={sender.username}
						className="h-full w-full object-cover"
					/>
				) : (
					sender?.name
						?.charAt(0)
						.toUpperCase()
				)}
			</Link>

			{/* Content */}
			<button
				type="button"
				onClick={handleNotificationClick}
				className="w-full text-left"
			>
				<p className="text-sm leading-6">
					<Link
						to={`/profile/${sender?.username}`}
						onClick={(e) => e.stopPropagation()}
						className="font-semibold hover:underline"
					>
						{sender?.username}
					</Link>{" "}
					<span className="text-white/70">
						{getMessage()}
					</span>
				</p>

				<p className="mt-1 text-xs text-white/30">
					{new Date(
						notification.createdAt
					).toLocaleString()}
				</p>
			</button>
			{/* Unread indicator */}
			{!notification.isRead && (
				<div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-white" />
			)}
		</div>
	);
};

export default NotificationCard;