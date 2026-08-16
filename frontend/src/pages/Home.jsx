import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";

const Home = () => {
	const posts = [
		{
			_id: "1",
			user: {
				name: "John Doe",
				username: "johndoe",
			},
			content:
				"Building something cool today. Really enjoying this project!",
			image: null,
			time: "2h",
			likes: 24,
			comments: 5,
		},
		{
			_id: "2",
			user: {
				name: "Jane",
				username: "jane",
			},
			content:
				"Dark UI + clean architecture just hits different. 🖤",
			image: null,
			time: "4h",
			likes: 42,
			comments: 8,
		},
	];

	return (
		<section className="mx-auto w-full max-w-2xl">
			<div className="border-b border-white/10 px-4 py-5">
				<h1 className="text-xl font-semibold">
					Home
				</h1>
			</div>
			<CreatePost/>

			{posts.map((post) => (
				<PostCard
					key={post._id}
					post={post}
				/>
			))}
		</section>
	);
};

export default Home;