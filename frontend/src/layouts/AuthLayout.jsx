import { Outlet } from "react-router-dom";

const AuthLayout = () => {
	return (
		<div className="min-h-screen bg-[#050505] px-4 py-10 text-white">
			<div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center justify-center">
				<Outlet />
			</div>
		</div>
	);
};

export default AuthLayout;