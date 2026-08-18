import CreatePost from "../components/CreatePost";

const Create = () => {
	return (
		<section className="mx-auto w-full max-w-2xl">
			<div className="border-b border-white/10 px-4 py-5">
				<h1 className="text-xl font-semibold">
					Create Post
				</h1>
			</div>

			<CreatePost />
		</section>
	);
};

export default Create;