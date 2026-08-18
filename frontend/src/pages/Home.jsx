import { useQuery } from "@tanstack/react-query";

import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import { getFeed } from "../services/post.service";

const Home = () => {
	const {
		data,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["feed"],
		queryFn: () => getFeed(1, 10),
	});

	const posts = data?.posts || [];

	if (isLoading) {
		return (
			<section className="mx-auto w-full max-w-2xl">
				<div className="border-b border-white/10 px-4 py-5">
					<h1 className="text-xl font-semibold">
						Home
					</h1>
				</div>

				<div className="px-4 py-10 text-center text-sm text-white/50">
					Loading your feed...
				</div>
			</section>
		);
	}

	if (isError) {
		return (
			<section className="mx-auto w-full max-w-2xl">
				<div className="border-b border-white/10 px-4 py-5">
					<h1 className="text-xl font-semibold">
						Home
					</h1>
				</div>

				<div className="px-4 py-10 text-center">
					<p className="text-sm text-red-400">
						{error?.response?.data?.message ||
							"Failed to load feed"}
					</p>
				</div>
			</section>
		);
	}

	return (
		<section className="mx-auto w-full max-w-2xl">
			{/* Header */}
			<div className="border-b border-white/10 px-4 py-5">
				<h1 className="text-xl font-semibold">
					Home
				</h1>
			</div>

			{/* Create Post */}
			<CreatePost />

			{/* Feed */}
			{posts.length === 0 ? (
				<div className="px-4 py-16 text-center">
					<p className="text-white/60">
						Your feed is empty.
					</p>

					<p className="mt-1 text-sm text-white/30">
						Follow people or create a post to
						get started.
					</p>
				</div>
			) : (
				posts.map((post) => (
					<PostCard
						key={post._id}
						post={post}
					/>
				))
			)}
		</section>
	);
};

export default Home;