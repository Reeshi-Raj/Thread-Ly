import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FiImage, FiSend } from "react-icons/fi";

import { createPost } from "../services/post.service";

const CreatePost = () => {
	const fileInputRef = useRef(null);
	const queryClient = useQueryClient();

	const [content, setContent] = useState("");
	const [imagePreview, setImagePreview] = useState(null);
	const [selectedImage, setSelectedImage] = useState(null);

	const createPostMutation = useMutation({
		mutationFn: createPost,

		onSuccess: () => {
			toast.success("Post created successfully");

			setContent("");
			setSelectedImage(null);

			if (imagePreview) {
				URL.revokeObjectURL(imagePreview);
			}

			setImagePreview(null);

			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}

			queryClient.invalidateQueries({
				queryKey: ["feed"],
			});
		},

		onError: (error) => {
			toast.error(
				error.response?.data?.message ||
					"Failed to create post"
			);
		},
	});

	const handleImageChange = (e) => {
		const file = e.target.files?.[0];

		if (!file) return;

		if (imagePreview) {
			URL.revokeObjectURL(imagePreview);
		}

		setSelectedImage(file);

		const previewUrl = URL.createObjectURL(file);
		setImagePreview(previewUrl);
	};

	const removeImage = () => {
		if (imagePreview) {
			URL.revokeObjectURL(imagePreview);
		}

		setImagePreview(null);
		setSelectedImage(null);

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!content.trim() && !selectedImage) {
			return;
		}

		const formData = new FormData();
		formData.append("text", content.trim());

		if (selectedImage) {
			formData.append("image", selectedImage);
		}

		createPostMutation.mutate(formData);
	};

	return (
		<form onSubmit={handleSubmit} className="border-b border-white/10 px-4 py-5">
			<div className="rounded-[28px] border border-white/10 bg-white/2 p-4 shadow-[0_18px_36px_rgba(0,0,0,0.18)]">
				<div className="flex gap-3">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-white to-white/80 text-sm font-black text-black shadow-[0_8px_18px_rgba(255,255,255,0.15)]">
						T
					</div>

					<div className="min-w-0 flex-1">
						<textarea
							value={content}
							onChange={(e) => setContent(e.target.value)}
							placeholder="What's on your mind?"
							rows={3}
							className="w-full resize-none bg-transparent text-[15px] leading-6 text-white placeholder:text-white/40 outline-none"
						/>

						{imagePreview && (
							<div className="relative mt-3 overflow-hidden rounded-2xl border border-white/10">
								<img
									src={imagePreview}
									alt="Preview"
									className="max-h-100 w-full object-cover"
								/>

								<button
									type="button"
									onClick={removeImage}
									className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-sm text-white backdrop-blur transition hover:bg-black"
								>
									Remove
								</button>
							</div>
						)}

						<div className="mt-3 flex items-center justify-between gap-3">
							<div>
								<input
									ref={fileInputRef}
									type="file"
									accept="image/*"
									onChange={handleImageChange}
									className="hidden"
									id="post-image"
								/>

								<label
									htmlFor="post-image"
									className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/2 px-3 py-2 text-sm text-white/70 transition hover:border-white/20 hover:text-white"
								>
									<FiImage className="text-base" />
									Add image
								</label>
							</div>

							<button
								type="submit"
								disabled={
									createPostMutation.isPending ||
									(!content.trim() && !selectedImage)
								}
								className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-[0_8px_18px_rgba(255,255,255,0.18)] transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
							>
								<FiSend className="text-sm" />
								{createPostMutation.isPending ? "Posting..." : "Post"}
							</button>
						</div>
					</div>
				</div>
			</div>
		</form>
	);
};

export default CreatePost;