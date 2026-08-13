import { Outlet } from "react-router-dom";

const MainLayout = () => {
	return (
		<div className="min-h-screen">
			<header className="border-b">
				<div className="mx-auto max-w-5xl px-4 py-4">
					<h1 className="text-xl font-bold">Threads Clone</h1>
				</div>
			</header>

			<main className="mx-auto max-w-5xl px-4 py-6">
				<Outlet />
			</main>
		</div>
	);
};

export default MainLayout;