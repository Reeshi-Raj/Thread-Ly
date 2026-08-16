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
		<div className="w-full">
			{/* Header */}
			<div className="mb-8 text-center">
				<h1 className="text-3xl font-bold tracking-tight text-white">
					Create your account
				</h1>

				<p className="mt-2 text-sm text-white/50">
					Join Threads Clone today.
				</p>
			</div>

			{/* Signup Card */}
			<div className="rounded-2xl border border-white/10 bg-[#101010] p-6 shadow-2xl">
				<form
					onSubmit={handleSubmit}
					className="space-y-5"
				>
					{/* Name */}
					<div>
						<label
							htmlFor="name"
							className="mb-2 block text-sm font-medium text-white/80"
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
							className="w-full rounded-xl border border-white/10 bg-[#181818] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-white/30 focus:ring-1 focus:ring-white/20"
							required
						/>
					</div>

					{/* Username */}
					<div>
						<label
							htmlFor="username"
							className="mb-2 block text-sm font-medium text-white/80"
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
							className="w-full rounded-xl border border-white/10 bg-[#181818] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-white/30 focus:ring-1 focus:ring-white/20"
							required
						/>
					</div>

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
							placeholder="Enter your email"
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
							placeholder="Create a password"
							className="w-full rounded-xl border border-white/10 bg-[#181818] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-white/30 focus:ring-1 focus:ring-white/20"
							required
						/>
					</div>

					{/* Submit */}
					<button
						type="submit"
						disabled={signupMutation.isPending}
						className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{signupMutation.isPending
							? "Creating account..."
							: "Create account"}
					</button>
				</form>
			</div>

			{/* Login Link */}
			<p className="mt-6 text-center text-sm text-white/50">
				Already have an account?{" "}
				<Link
					to="/login"
					className="font-medium text-white underline underline-offset-4 hover:text-white/80"
				>
					Login
				</Link>
			</p>
		</div>
	);
};

export default Signup;