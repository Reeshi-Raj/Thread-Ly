import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
	const { user } = useAuth();

	return (
		<header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/80 backdrop-blur-xl">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
				<Link to="/" className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.02] px-3 py-2 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition hover:border-white/20">
					<span className="logo-mark text-xl font-black tracking-[-0.09em] text-white">
						Thread-Ly
					</span>
				</Link>

				<div className="flex items-center gap-3">
					{user && (
						<Link
							to={`/profile/${user.username}`}
							className="group flex items-center gap-2"
						>
							<div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-linear-to-br from-white via-white/90 to-white/70 text-sm font-bold text-black shadow-[0_8px_20px_rgba(255,255,255,0.12)] transition group-hover:scale-[1.03]">
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