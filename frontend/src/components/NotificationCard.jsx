import { Link, useNavigate } from "react-router-dom";
import {
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import {
	FiBell,
	FiHeart,
	FiMessageSquare,
	FiUserPlus,
	FiCornerDownRight,
} from "react-icons/fi";
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

	const getIcon = () => {
		switch (notification.type) {
			case "FOLLOW":
				return <FiUserPlus className="text-base" />;
			case "LIKE":
				return <FiHeart className="text-base" />;
			case "COMMENT":
				return <FiMessageSquare className="text-base" />;
			case "REPLY":
				return <FiCornerDownRight className="text-base" />;
			default:
				return <FiBell className="text-base" />;
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
			className={`flex gap-3 border-b border-white/10 px-4 py-4 transition duration-200 hover:bg-white/[0.03] ${
				!notification.isRead ? "bg-white/[0.03]" : ""
			}`}
		>
			<Link
				to={`/profile/${sender?.username}`}
				onClick={(e) => e.stopPropagation()}
				className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white text-sm font-bold text-black shadow-[0_8px_18px_rgba(255,255,255,0.1)]"
			>
				{sender?.profilePic?.url ? (
					<img
						src={sender.profilePic.url}
						alt={sender.username}
						className="h-full w-full object-cover"
					/>
				) : (
					sender?.name?.charAt(0).toUpperCase()
				)}
			</Link>

			<button
				type="button"
				onClick={handleNotificationClick}
				className="w-full text-left"
			>
				<div className="flex items-start gap-3">
					<div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80">
						{getIcon()}
					</div>

					<div className="min-w-0 flex-1">
						<p className="text-sm leading-6 text-white/90">
							<Link
								to={`/profile/${sender?.username}`}
								onClick={(e) => e.stopPropagation()}
								className="font-semibold text-white hover:underline"
							>
								{sender?.username}
							</Link>{" "}
							<span className="text-white/70">
								{getMessage()}
							</span>
						</p>

						<p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-white/30">
							{new Date(notification.createdAt).toLocaleString()}
						</p>
					</div>
				</div>
			</button>

			{!notification.isRead && (
				<div className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.7)]" />
			)}
		</div>
	);
};

export default NotificationCard;