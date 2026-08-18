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
import Signup from "./pages/Signup";
import Create from "./pages/Create";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				{/* Protected Routees */}
				<Route element={<ProtectedRoute />}>
					<Route element={<MainLayout />}>
						<Route path="/" element={<Home />} />
						<Route path="/create" element={<Create />} />
					</Route>
				</Route>

				{/* public routes */}
				<Route element={<AuthLayout />}>
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
				</Route>

				{/* Fallback */}
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;