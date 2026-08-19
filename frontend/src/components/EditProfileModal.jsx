import { useEffect, useState } from "react";

const EditProfileModal = ({
	user,
	isOpen,
	onClose,
	onSave,
	isPending,
}) => {
	const [activeTab, setActiveTab] = useState("profile");
	const [formData, setFormData] = useState({
		name: "",
		username: "",
		bio: "",
	});

	const [passwordData, setPasswordData] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	const [profilePic, setProfilePic] = useState(null);
	const [preview, setPreview] = useState("");

	useEffect(() => {
		if (user && isOpen) {
			setFormData({
				name: user.name || "",
				username: user.username || "",
				bio: user.bio || "",
			});

			setPasswordData({
				currentPassword: "",
				newPassword: "",
				confirmPassword: "",
			});

			setPreview(user.profilePic?.url || "");
			setProfilePic(null);
			setActiveTab("profile");
		}
	}, [user, isOpen]);

	if (!isOpen) return null;

	const handleChange = (e) => {
		const { name, value } = e.target;

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handlePasswordChange = (e) => {
		const { name, value } = e.target;

		setPasswordData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleImageChange = (e) => {
		const file = e.target.files?.[0];

		if (!file) return;

		setProfilePic(file);

		const imageUrl = URL.createObjectURL(file);
		setPreview(imageUrl);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (activeTab === "profile") {
			onSave({
				formData,
				profilePic,
			});
		} else {
			onSave({
				passwordData,
				isPasswordChange: true,
			});
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
			<div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#181818] p-6 shadow-xl">
				{/* Header */}
				<div className="mb-6 flex items-center justify-between">
					<h2 className="text-xl font-semibold text-white">
						{activeTab === "profile"
							? "Edit Profile"
							: "Change Password"}
					</h2>

					<button
						type="button"
						onClick={onClose}
						className="text-xl text-white/50 transition hover:text-white"
					>
						×
					</button>
				</div>

				{/* Tabs */}
				<div className="mb-6 flex gap-2 border-b border-white/10">
					<button
						type="button"
						onClick={() => setActiveTab("profile")}
						className={`pb-3 text-sm font-medium transition ${
							activeTab === "profile"
								? "border-b-2 border-white text-white"
								: "text-white/50 hover:text-white"
						}`}
					>
						Profile
					</button>

					<button
						type="button"
						onClick={() => setActiveTab("password")}
						className={`pb-3 text-sm font-medium transition ${
							activeTab === "password"
								? "border-b-2 border-white text-white"
								: "text-white/50 hover:text-white"
						}`}
					>
						Password
					</button>
				</div>

				<form
					onSubmit={handleSubmit}
					className="space-y-5"
				>
					{/* Profile Tab */}
					{activeTab === "profile" && (
						<>
							{/* Profile Picture */}
							<div className="flex flex-col items-center">
								<div className="h-24 w-24 overflow-hidden rounded-full bg-white">
									{preview ? (
										<img
											src={preview}
											alt="Profile preview"
											className="h-full w-full object-cover"
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center text-3xl font-bold text-black">
											{formData.name
												?.charAt(0)
												.toUpperCase()}
										</div>
									)}
								</div>

								<label className="mt-3 cursor-pointer text-sm font-medium text-white underline">
									Change photo

									<input
										type="file"
										accept="image/*"
										onChange={handleImageChange}
										className="hidden"
									/>
								</label>
							</div>

							{/* Name */}
							<div>
								<label className="mb-1 block text-sm text-white/70">
									Name
								</label>

								<input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleChange}
									className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none transition focus:border-white/30"
								/>
							</div>

							{/* Username */}
							<div>
								<label className="mb-1 block text-sm text-white/70">
									Username
								</label>

								<input
									type="text"
									name="username"
									value={formData.username}
									onChange={handleChange}
									className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none transition focus:border-white/30"
								/>
							</div>

							{/* Bio */}
							<div>
								<label className="mb-1 block text-sm text-white/70">
									Bio
								</label>

								<textarea
									name="bio"
									value={formData.bio}
									onChange={handleChange}
									rows={3}
									maxLength={160}
									className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none transition focus:border-white/30"
								/>
							</div>
						</>
					)}

					{/* Password Tab */}
					{activeTab === "password" && (
						<>
							{/* Current Password */}
							<div>
								<label className="mb-1 block text-sm text-white/70">
									Current Password
								</label>

								<input
									type="password"
									name="currentPassword"
									value={passwordData.currentPassword}
									onChange={handlePasswordChange}
									className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none transition focus:border-white/30"
									placeholder="Enter current password"
								/>
							</div>

							{/* New Password */}
							<div>
								<label className="mb-1 block text-sm text-white/70">
									New Password
								</label>

								<input
									type="password"
									name="newPassword"
									value={passwordData.newPassword}
									onChange={handlePasswordChange}
									className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none transition focus:border-white/30"
									placeholder="Enter new password"
								/>
							</div>

							{/* Confirm Password */}
							<div>
								<label className="mb-1 block text-sm text-white/70">
									Confirm Password
								</label>

								<input
									type="password"
									name="confirmPassword"
									value={passwordData.confirmPassword}
									onChange={handlePasswordChange}
									className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none transition focus:border-white/30"
									placeholder="Confirm new password"
								/>
							</div>
						</>
					)}

					{/* Actions */}
					<div className="flex justify-end gap-3 pt-2">
						<button
							type="button"
							onClick={onClose}
							className="rounded-full px-4 py-2 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
						>
							Cancel
						</button>

						<button
							type="submit"
							disabled={isPending}
							className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90 disabled:opacity-50"
						>
							{isPending ? "Saving..." : "Save"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EditProfileModal;