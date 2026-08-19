import { useMutation,useQuery,useQueryClient, } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { getUserProfile } from "../services/user.service";
import { getUserPosts } from "../services/post.service";
import { getMe } from "../services/auth.service";
import PostCard from "../components/PostCard";

import { useState } from "react";
import EditProfileModal from "../components/EditProfileModal";
import { updateProfile, updatePassword } from "../services/user.service";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();
	const { username } = useParams();
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const updateProfileMutation = useMutation({
	mutationFn: updateProfile,

	onSuccess: async (data) => {
		toast.success(
			data.message || "Profile updated successfully"
		);

		// Refresh current profile
		await queryClient.invalidateQueries({
			queryKey: ["profile", username],
		});

		// Refresh logged-in user
		await queryClient.invalidateQueries({
			queryKey: ["me"],
		});

		setIsEditModalOpen(false);

        navigate(`/profile/${data.user.username}`);
	},

	onError: (error) => {
		toast.error(
			error.response?.data?.message ||
				"Failed to update profile"
		);
	},
});

const updatePasswordMutation = useMutation({
	mutationFn: updatePassword,

	onSuccess: (data) => {
		toast.success(
			data.message || "Password updated successfully"
		);

		setIsEditModalOpen(false);
	},

	onError: (error) => {
		toast.error(
			error.response?.data?.message ||
				"Failed to update password"
		);
	},
});

const handleSaveProfile = ({
	formData,
	profilePic,
	passwordData,
	isPasswordChange,
}) => {
	// Handle password change
	if (isPasswordChange) {
		updatePasswordMutation.mutate(passwordData);
		return;
	}

	// Handle profile update
	const data = new FormData();

	data.append("name", formData.name);
	data.append("username", formData.username);
	data.append("bio", formData.bio);

	if (profilePic) {
		data.append("profilePic", profilePic);
	}

	updateProfileMutation.mutate(data);
};

	const {
		data,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["profile", username],
		queryFn: () => getUserProfile(username),
		enabled: !!username,
	});

    const {
	    data: postsData,
	    isLoading: postsLoading,
	    isError: postsError,
    } = useQuery({
	    queryKey: ["userPosts", username],
	    queryFn: () => getUserPosts(username),
	    enabled: !!username,
    });

    const { data: meData } = useQuery({
	    queryKey: ["me"],
	    queryFn: getMe,
    });

    const posts = postsData?.posts || [];
    const user = data?.user;
    const isOwnProfile = meData?.user?._id === user?._id;

	if (isLoading) {
		return (
			<div className="p-6 text-center text-white/60">
				Loading profile...
			</div>
		);
	}

	if (isError) {
		return (
			<div className="p-6 text-center text-red-400">
				{error.response?.data?.message ||
					"Failed to load profile"}
			</div>
		);
	}

	return (
		<div className="mx-auto w-full max-w-2xl">
			<div className="border-b border-white/10 px-6 py-8">
				<div className="flex items-start justify-between">
					<div className="flex items-center gap-4">
						<div className="h-20 w-20 overflow-hidden rounded-full bg-white/10">
							{user.profilePic.url ? (
								<img
									src={user.profilePic.url}
									alt={user.username}
									className="h-full w-full object-cover"
								/>
							) : (
								<div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-white/50">
									{user.name?.charAt(0)}
								</div>
							)}
						</div>

						<div>
							<h1 className="text-xl font-bold text-white">
								{user.name}
							</h1>

							<p className="text-sm text-white/50">
								@{user.username}
							</p>
						</div>
					</div>

					{isOwnProfile && (
						<button
							type="button"
							onClick={() => setIsEditModalOpen(true)}
							className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
						>
							Edit Profile
						</button>
					)}
				</div>

				{user.bio && (
					<p className="mt-5 text-sm text-white/80">
						{user.bio}
					</p>
				)}

				<div className="mt-5 flex gap-6 text-sm">
					<span>
						<strong className="text-white">
							{user.followersCount}
						</strong>{" "}
						<span className="text-white/50">
							Followers
						</span>
					</span>

					<span>
						<strong className="text-white">
							{user.followingCount}
						</strong>{" "}
						<span className="text-white/50">
							Following
						</span>
					</span>
				</div>
			</div>
            <div className="divide-y divide-white/10">
	{postsLoading && (
		<div className="p-6 text-center text-white/50">
			Loading posts...
		</div>
        
	)}

	{postsError && (
		<div className="p-6 text-center text-red-400">
			Failed to load posts
		</div>
	)}

	{!postsLoading &&
		!postsError &&
		posts.length === 0 && (
			<div className="p-6 text-center text-white/50">
				No posts yet.
			</div>
		)}

	{posts.map((post) => (
		<PostCard key={post._id} post={post} />
	))}
</div>
    <EditProfileModal
	    user={user}
	    isOpen={isEditModalOpen}
	    onClose={() => setIsEditModalOpen(false)}
	    onSave={handleSaveProfile}
	    isPending={updateProfileMutation.isPending || updatePasswordMutation.isPending}
    />
		</div>
	);
};

export default Profile;