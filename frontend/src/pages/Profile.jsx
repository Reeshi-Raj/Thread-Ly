import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { getUserProfile } from "../services/user.service";
import { getUserPosts } from "../services/post.service";
import PostCard from "../components/PostCard";

const Profile = () => {
	const { username } = useParams();

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

    const posts = postsData?.posts || [];

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

	const user = data?.user;

	return (
		<div className="mx-auto w-full max-w-2xl">
			<div className="border-b border-white/10 px-6 py-8">
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
		</div>
	);
};

export default Profile;