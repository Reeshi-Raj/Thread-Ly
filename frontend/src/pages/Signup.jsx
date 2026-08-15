import { useState } from "react";
import {
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { signupUser } from "../services/auth.service";

const Signup = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const [formData, setFormData] = useState({
		name: "",
		username: "",
		email: "",
		password: "",
	});

	const signupMutation = useMutation({
		mutationFn: signupUser,

		onSuccess: async (data) => {
			toast.success(
				data.message || "Account created successfully"
			);

			// Signup already creates JWT cookie.
			// So refresh the current-user query.
			await queryClient.invalidateQueries({
				queryKey: ["me"],
			});

			navigate("/");
		},

		onError: (error) => {
			toast.error(
				error.response?.data?.message ||
					"Signup failed"
			);
		},
	});

	const handleChange = (e) => {
		const { name, value } = e.target;

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		signupMutation.mutate(formData);
	};

	return (
		<div className="rounded-2xl border bg-white p-6 shadow-sm">
			<h1 className="text-2xl font-bold">
				Create your account
			</h1>

			<p className="mt-1 text-sm text-gray-500">
				Join Threads Clone today.
			</p>

			<form
				onSubmit={handleSubmit}
				className="mt-6 space-y-4"
			>
				<div>
					<label
						htmlFor="name"
						className="mb-1 block text-sm font-medium"
					>
						Name
					</label>

					<input
						id="name"
						name="name"
						type="text"
						value={formData.name}
						onChange={handleChange}
						placeholder="Enter your name"
						className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
						required
					/>
				</div>

				<div>
					<label
						htmlFor="username"
						className="mb-1 block text-sm font-medium"
					>
						Username
					</label>

					<input
						id="username"
						name="username"
						type="text"
						value={formData.username}
						onChange={handleChange}
						placeholder="Choose a username"
						className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
						required
					/>
				</div>

				<div>
					<label
						htmlFor="email"
						className="mb-1 block text-sm font-medium"
					>
						Email
					</label>

					<input
						id="email"
						name="email"
						type="email"
						value={formData.email}
						onChange={handleChange}
						placeholder="Enter your email"
						className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
						required
					/>
				</div>

				<div>
					<label
						htmlFor="password"
						className="mb-1 block text-sm font-medium"
					>
						Password
					</label>

					<input
						id="password"
						name="password"
						type="password"
						value={formData.password}
						onChange={handleChange}
						placeholder="Create a password"
						className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
						required
					/>
				</div>

				<button
					type="submit"
					disabled={signupMutation.isPending}
					className="w-full rounded-lg bg-black px-4 py-2 font-medium text-white disabled:opacity-50"
				>
					{signupMutation.isPending
						? "Creating account..."
						: "Create account"}
				</button>
			</form>

			<p className="mt-5 text-center text-sm text-gray-500">
				Already have an account?{" "}
				<Link
					to="/login"
					className="font-medium text-black underline"
				>
					Login
				</Link>
			</p>
		</div>
	);
};

export default Signup;