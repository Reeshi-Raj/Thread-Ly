import { Link } from "react-router-dom";
import { useQuery,useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deletePost } from "../services/post.service";
import { getMe } from "../services/auth.service";

const PostCard = ({ post }) => {
	const queryClient = useQueryClient();

const deleteMutation = useMutation({
	mutationFn: deletePost,

	onSuccess: async (data) => {
		toast.success(
			data.message || "Post deleted successfully"
		);

		await queryClient.invalidateQueries({
			queryKey: ["feed"],
		});

		await queryClient.invalidateQueries({
			queryKey: ["userPosts"],
		});
	},

	onError: (error) => {
		toast.error(
			error.response?.data?.message ||
				"Failed to delete post"
		);
	},
});
const handleDelete = () => {
	if (window.confirm("Are you sure you want to delete this post?")) {
		deleteMutation.mutate(post._id);
	}
};
const { data: meData } = useQuery({
	queryKey: ["me"],
	queryFn: getMe,
});

const currentUserId = meData?.user?._id;

const isOwner =
	currentUserId === post.user?._id;


	if (post.isDeleted) {
	return (
		<article className="border-b border-white/10 px-4 py-5">
			<div className="flex items-start gap-3">
				{/* Avatar */}
				<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white/40">
					{post.user?.name
						?.charAt(0)
						.toUpperCase()}
				</div>

				<div className="min-w-0 flex-1">
					{/* User Header */}
					<div className="flex items-center gap-2">
						<span className="font-semibold text-white/50">
							{post.user?.username}
						</span>

						<span className="text-sm text-white/30">
							· {post.createdAt}
						</span>
					</div>

					{/* Deleted Message */}
					<div className="mt-3 rounded-xl border border-white/10 bg-white/3 px-4 py-4">
						<p className="text-sm italic text-white/40">
							This post was deleted.
						</p>
					</div>

					{/* Keep comment count visible */}
					<div className="mt-4 text-sm text-white/40">
						💬 {post.comments?.length || 0}
					</div>
				</div>
			</div>
		</article>
	);
}else{
	return (
		<article className="border-b border-white/10 px-4 py-5">
			{/* User Header */}
			<div className="flex items-start gap-3">
				{/* Avatar */}
				<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-black">
					{post.user?.name?.charAt(0).toUpperCase()}
				</div>

				<div className="min-w-0 flex-1">
					{post.isDeleted ? (
						<p className="mt-2 text-sm italic text-white/40">
							This post was deleted
						</p>
					) : (
						<>
							{/* Username + Time */}
							<div className="flex items-center gap-2">
								<Link
									to={`/profile/${post.user?.username}`}
									className="font-semibold hover:underline"
								>
									{post.user?.username}
								</Link>

								<span className="text-sm text-white/40">
									· {post.createdAt}
								</span>
							</div>

							{/* Content */}
							<p className="mt-2 whitespace-pre-wrap text-[15px] leading-6 text-white/90">
								{post.text}
							</p>

							{/* Post Image */}
							{post.image?.url && (
								<div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
									<img
										src={post.image.url}
										alt="Post"
										className="max-h-150 w-full object-cover"
									/>
								</div>
							)}

							{/* Actions */}
							<div className="mt-4 flex items-center gap-6 text-sm text-white/50">
								<button
									type="button"
									className="transition hover:text-white"
								>
									♡ {post.likes?.length || 0}
								</button>

								<button
									type="button"
									className="transition hover:text-white"
								>
									💬 {post.comments?.length || 0}
								</button>

								<button
									type="button"
									className="transition hover:text-white"
								>
									↗ Share
								</button>

								{isOwner && !post.isDeleted && (
									<button
										type="button"
										onClick={handleDelete}
										disabled={deleteMutation.isPending}
										className="transition hover:text-red-400 disabled:opacity-50"
									>
										{deleteMutation.isPending
											? "Deleting..."
											: "Delete"}
									</button>
								)}
							</div>
						</>
					)}
				</div>
			</div>
		</article>
	);
}
};

export default PostCard;