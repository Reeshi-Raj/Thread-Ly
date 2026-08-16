import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MobileNav = () => {
	const location = useLocation();
	const { user } = useAuth();

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
			</div>
		</nav>
	);
};

export default MobileNav;