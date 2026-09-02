import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
	FiBell,
	FiHome,
	FiLogOut,
	FiPlus,
	FiSearch,
	FiUser,
} from "react-icons/fi";
import { logoutUser } from "../services/auth.service";

const MobileNav = () => {
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

	const itemClass = (active) =>
		`flex h-11 w-11 items-center justify-center rounded-2xl border transition ${
			active
				? "border-white/10 bg-white/10 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
				: "border-transparent text-white/55 hover:bg-white/5 hover:text-white"
		}`;

	return (
		<nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#050505]/90 backdrop-blur-xl lg:hidden">
			<div className="mx-auto flex h-16 max-w-md items-center justify-around px-4">
				<Link to="/" className={itemClass(isActive("/"))}>
					<FiHome className="text-lg" />
				</Link>

				<Link to="/notifications" className={itemClass(isActive("/notifications"))}>
					<FiBell className="text-lg" />
				</Link>

				<Link to="/search" className={itemClass(isActive("/search"))}>
					<FiSearch className="text-lg" />
				</Link>

				<Link to="/create" className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-black shadow-[0_8px_20px_rgba(255,255,255,0.18)] transition hover:scale-[1.02]">
					<FiPlus className="text-xl" />
				</Link>

				{user && (
					<Link
						to={`/profile/${user.username}`}
						className={itemClass(isActive(`/profile/${user.username}`))}
					>
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-white to-white/80 text-[11px] font-bold text-black">
							{user.name?.charAt(0).toUpperCase()}
						</div>
					</Link>
				)}

				<button
					type="button"
					onClick={() => logoutMutation.mutate()}
					disabled={logoutMutation.isPending}
					className="flex h-11 w-11 items-center justify-center rounded-2xl border border-transparent text-white/55 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
					title="Logout"
				>
					<FiLogOut className="text-lg" />
				</button>
			</div>
		</nav>
	);
};

export default MobileNav;