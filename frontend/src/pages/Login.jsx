import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { loginUser } from "../services/auth.service";

const Login = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const loginMutation = useMutation({
		mutationFn: loginUser,

		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["me"],
			});

			toast.success("Login successful");

			navigate("/");
		},

		onError: (error) => {
			toast.error(
				error.response?.data?.message ||
					"Login failed"
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

		loginMutation.mutate(formData);
	};

	return (
		<div className="w-full max-w-md">
			{/* Header */}
			<div className="mb-8 text-center">
				<h1 className="text-3xl font-bold tracking-tight text-white">
					Welcome back
				</h1>

				<p className="mt-2 text-sm text-white/50">
					Login to continue to Thread-Ly.
				</p>
			</div>

			{/* Login Card */}
			<div className="rounded-2xl border border-white/10 bg-[#101010] p-6 shadow-2xl">
				<form
					onSubmit={handleSubmit}
					className="space-y-5"
				>
					{/* Email */}
					<div>
						<label
							htmlFor="email"
							className="mb-2 block text-sm font-medium text-white/80"
						>
							Email
						</label>

						<input
							id="email"
							name="email"
							type="email"
							value={formData.email}
							onChange={handleChange}
							placeholder="Enter email"
							className="w-full rounded-xl border border-white/10 bg-[#181818] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-white/30 focus:ring-1 focus:ring-white/20"
							required
						/>
					</div>

					{/* Password */}
					<div>
						<label
							htmlFor="password"
							className="mb-2 block text-sm font-medium text-white/80"
						>
							Password
						</label>

						<input
							id="password"
							name="password"
							type="password"
							value={formData.password}
							onChange={handleChange}
							placeholder="Enter password"
							className="w-full rounded-xl border border-white/10 bg-[#181818] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-white/30 focus:ring-1 focus:ring-white/20"
							required
						/>
					</div>

					{/* Submit */}
					<button
						type="submit"
						disabled={loginMutation.isPending}
						className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{loginMutation.isPending
							? "Logging in..."
							: "Login"}
					</button>
				</form>
			</div>

			{/* Signup */}
			<p className="mt-6 text-center text-sm text-white/50">
				Don't have an account?{" "}
				<Link
					to="/signup"
					className="font-medium text-white underline underline-offset-4 hover:text-white/80"
				>
					Sign up
				</Link>
			</p>
		</div>
	);
};

export default Login;