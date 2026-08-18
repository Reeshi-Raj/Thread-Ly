import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
	return (
		<article className="border-b border-white/10 px-4 py-5">
			{/* User Header */}
			<div className="flex items-start gap-3">
				{/* Avatar */}
				<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-black">
					{post.user?.name?.charAt(0).toUpperCase()}
				</div>

				<div className="min-w-0 flex-1">
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
					{post.image && (
						<div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
							<img
								src={post.image}
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
					</div>
				</div>
			</div>
		</article>
	);
};

export default PostCard;