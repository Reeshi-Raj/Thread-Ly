import {
	BrowserRouter,
	Routes,
	Route,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { getMe } from "./services/auth.service";

const App = () => {
      useEffect(() => {
		const testApi = async () => {
			try {
				const data = await getMe();

				console.log("GET ME RESPONSE:", data);
			} catch (error) {
				console.error(
					"GET ME ERROR:",
					error.response?.data || error.message
				);
			}
		};

		testApi();
	}, []);
	return (
		<BrowserRouter>
			<Routes>
				{/* Application routes */}
				<Route element={<MainLayout />}>
					<Route path="/" element={<Home />} />
				</Route>

				{/* Authentication routes */}
				<Route element={<AuthLayout />}>
					<Route path="/login" element={<Login />} />
				</Route>

				{/* Fallback */}
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;