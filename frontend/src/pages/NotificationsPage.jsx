import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../services/notification.service";
import NotificationCard from "../components/NotificationCard";

const NotificationsPage = () => {
	const {
		data,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["notifications"],
		queryFn: getNotifications,
	});

	if (isLoading) {
		return (
			<div className="min-h-screen border-x border-white/10">
				<div className="border-b border-white/10 px-4 py-5">
					<h1 className="text-xl font-bold">
						Notifications
					</h1>
				</div>

				<p className="px-4 py-8 text-center text-sm text-white/40">
					Loading notifications...
				</p>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="min-h-screen border-x border-white/10">
				<div className="border-b border-white/10 px-4 py-5">
					<h1 className="text-xl font-bold">
						Notifications
					</h1>
				</div>

				<p className="px-4 py-8 text-center text-sm text-red-400">
					Failed to load notifications.
				</p>
			</div>
		);
	}

	const notifications = data?.notifications || [];

	return (
		<div className="min-h-screen border-x border-white/10">
			<div className="border-b border-white/10 px-4 py-5">
				<div className="flex items-center justify-between">
					<h1 className="text-xl font-bold">
						Notifications
					</h1>

					{data?.unreadCount > 0 && (
						<span className="text-sm text-white/40">
							{data.unreadCount} unread
						</span>
					)}
				</div>
			</div>

			{notifications.length === 0 ? (
				<p className="px-4 py-12 text-center text-sm text-white/40">
					No notifications yet.
				</p>
			) : (
				<div>
					{notifications.map((notification) => (
						<NotificationCard
							key={notification._id}
							notification={notification}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default NotificationsPage;