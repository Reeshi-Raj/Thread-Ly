import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
	FiBell,
	FiCompass,
	FiHome,
	FiLogOut,
	FiPlusSquare,
	FiSearch,
	FiUser,
} from "react-icons/fi";

import { logoutUser } from "../services/auth.service";

const Sidebar = () => {
	const location = useLocation();
	const { user } = useAuth();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const logoutMutation = useMutation({
		mutationFn: logoutUser,

		onSuccess: (data) => {
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

	const navItemClass = (path) => {
		const active = isActive(path);
		return `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
			active
				? "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
				: "text-white/60 hover:bg-white/5 hover:text-white"
		}`;
	};

	return (
		<aside className="fixed left-0 top-16 hidden h-[calc(100vh-4rem)] w-72 shrink-0 overflow-hidden border-r border-white/10 bg-[#050505]/80 lg:flex">
			<div className="flex h-full w-full flex-col p-5">
				<nav className="flex-1 space-y-2 pt-2">
					<Link to="/" className={navItemClass("/")}>
						<FiHome className="text-base" />
						<span>Home</span>
					</Link>

					<Link to="/notifications" className={navItemClass("/notifications")}>
						<FiBell className="text-base" />
						<span>Notifications</span>
					</Link>

					<Link to="/search" className={navItemClass("/search")}>
						<FiSearch className="text-base" />
						<span>Search</span>
					</Link>

					<Link to="/create" className={navItemClass("/create")}>
						<FiPlusSquare className="text-base" />
						<span>Create</span>
					</Link>

					{user && (
						<Link to={`/profile/${user.username}`} className={navItemClass(`/profile/${user.username}`)}>
							<FiUser className="text-base" />
							<span>Profile</span>
						</Link>
					)}
				</nav>

				<div className="mt-4 space-y-3">
					{user && (
						<div className="rounded-2xl border border-white/10 bg-white/2 p-3 shadow-[0_10px_35px_rgba(0,0,0,0.25)]">
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-white to-white/80 text-sm font-bold text-black">
									{user.name?.charAt(0).toUpperCase()}
								</div>

								<div className="min-w-0">
									<p className="truncate text-sm font-semibold text-white">
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
						className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/2 px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
					>
						<FiLogOut className="text-base" />
						<span>
							{logoutMutation.isPending ? "Logging out..." : "Logout"}
						</span>
					</button>
				</div>
			</div>
		</aside>
	);
};

export default Sidebar;