import { useAuth } from "../context/AuthContext";

const Home = () => {
	const {
		user,
		isLoading,
		isAuthenticated,
		isError,
	} = useAuth();

	if (isLoading) {
		return <div>Checking authentication...</div>;
	}

	return (
		<div className="min-h-screen flex flex-col items-center justify-center">
			<h1 className="text-4xl font-bold">
				Home Page
			</h1>

			<p className="mt-4">
				Authenticated: {String(isAuthenticated)}
			</p>

			<p>
				User: {user ? user.username : "Not logged in"}
			</p>

			<p>
				Error: {String(isError)}
			</p>
		</div>
	);
};

export default Home;