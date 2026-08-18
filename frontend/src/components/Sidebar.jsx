import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { logoutUser } from "../services/auth.service";

const Sidebar = () => {
	const location = useLocation();
	const { user } = useAuth();
	const navigate = useNavigate();
const queryClient = useQueryClient();

const logoutMutation = useMutation({
	mutationFn: logoutUser,

	onSuccess: (data) => {
		// Remove authenticated user data from React Query cache
		queryClient.removeQueries({
			queryKey: ["me"],
		});

		toast.success(
			data.message || "Logged out successfully"
		);

		navigate("/login");
	},

	onError: (error) => {
		toast.error(
			error.response?.data?.message ||
				"Logout failed"
		);
	},
});

	const isActive = (path) => location.pathname === path;

	return (
		<aside className="hidden w-64 shrink-0 border-r border-white/10 lg:block">
			<div className="sticky top-0 flex h-screen flex-col p-5">
				{/* Logo */}
				<Link
					to="/"
					className="mb-10 text-2xl font-bold tracking-tight"
				>
					threads.
				</Link>

				{/* Navigation */}
				<nav className="space-y-2">
					<Link
						to="/"
						className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
							isActive("/")
								? "bg-white/10 text-white"
								: "text-white/60 hover:bg-white/5 hover:text-white"
						}`}
					>
						Home
					</Link>

					<Link
						to="/search"
						className="block rounded-xl px-4 py-3 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
					>
						Search
					</Link>

					<Link
						to="/create"
						className="block rounded-xl px-4 py-3 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
					>
						Create
					</Link>

					{user && (
						<Link
							to={`/profile/${user.username}`}
							className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
								isActive(
									`/profile/${user.username}`
								)
									? "bg-white/10 text-white"
									: "text-white/60 hover:bg-white/5 hover:text-white"
							}`}
						>
							Profile
						</Link>
					)}
				</nav>

				{/* User section */}
				{user && (
					<div className="mt-auto border-t border-white/10 pt-4">
						<div className="flex items-center gap-3 rounded-xl px-3 py-3">
							<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-black">
								{user.name
									?.charAt(0)
									.toUpperCase()}
							</div>

							<div className="min-w-0">
								<p className="truncate text-sm font-medium">
									{user.name}
								</p>

								<p className="truncate text-xs text-white/40">
									@{user.username}
								</p>
							</div>
						</div>
					</div>
				)}
				<button
				type="button"
				onClick={() => logoutMutation.mutate()}
				disabled={logoutMutation.isPending}
				className="block w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
				>
				{logoutMutation.isPending
					? "Logging out..."
					: "Logout"}
				</button>
			</div>
		</aside>
	);
};
export default Sidebar;