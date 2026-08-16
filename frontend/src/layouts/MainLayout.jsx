import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import MobileNav from "../components/MobileNav";


const MainLayout = () => {
	return (
		<div className="min-h-screen bg-[#050505] text-white">
			<Navbar />

			<div className="mx-auto flex min-h-screen max-w-7xl">
				<Sidebar/>

				<main className="min-w-0 flex-1">
					<Outlet />
				</main>
			</div>
			<MobileNav />
		</div>
	);
};

export default MainLayout;