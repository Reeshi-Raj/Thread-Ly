import { Link } from "react-router-dom";

const NotFound = () => {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center">
			<h1 className="text-8xl font-bold">404</h1>

			<p className="mt-4 text-xl">
				Page not found
			</p>

			<Link
				to="/"
				className="mt-6 rounded-lg bg-black px-5 py-2 text-white hover:opacity-80"
			>
				Go Home
			</Link>
		</div>
	);
};

export default NotFound;