import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
	const { user } = useAuth();

	return (
		<header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/90 backdrop-blur">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
				<Link
					to="/"
					className="text-xl font-bold tracking-tight"
				>
					threads.
				</Link>

				<div className="flex items-center gap-3">
					{user && (
						<Link
							to={`/profile/${user.username}`}
							className="flex items-center gap-2"
						>
							<div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-semibold text-black">
								{user.name?.charAt(0).toUpperCase()}
							</div>
						</Link>
					)}
				</div>
			</div>
		</header>
	);
};

export default Navbar;