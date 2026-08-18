import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { logoutUser } from "../services/auth.service";

const MobileNav = () => {
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
		<nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#050505]/95 backdrop-blur lg:hidden">
			<div className="mx-auto flex h-16 max-w-md items-center justify-around px-4">
				<Link
					to="/"
					className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm transition ${
						isActive("/")
							? "bg-white/10 text-white"
							: "text-white/50"
					}`}
				>
					Home
				</Link>

				<Link
					to="/search"
					className="flex h-10 w-10 items-center justify-center rounded-xl text-sm text-white/50 transition"
				>
					Search
				</Link>

				<Link
					to="/create"
					className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-bold text-black transition"
				>
					+
				</Link>

				{user && (
					<Link
						to={`/profile/${user.username}`}
						className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold transition ${
							isActive(
								`/profile/${user.username}`
							)
								? "bg-white text-black"
								: "bg-white/10 text-white"
						}`}
					>
						{user.name
							?.charAt(0)
							.toUpperCase()}
					</Link>
				)}

				<button
					type="button"
					onClick={() => logoutMutation.mutate()}
					disabled={logoutMutation.isPending}
					className="flex h-10 w-10 items-center justify-center rounded-xl text-sm text-white/50 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
					title="Logout"
				>
					{logoutMutation.isPending ? "..." : "⏻"}
				</button>
			</div>
		</nav>
	);
};

export default MobileNav;