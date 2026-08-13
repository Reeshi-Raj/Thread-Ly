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

const App = () => {
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