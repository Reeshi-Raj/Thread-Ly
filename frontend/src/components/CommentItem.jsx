import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createComment, getCommentReplies } from "../services/comment.service";
import { useState } from "react";

const CommentItem = ({ comment }) => {
	const queryClient = useQueryClient();
	const [showReplies, setShowReplies] = useState(false);
	const [showReplyForm, setShowReplyForm] = useState(false);
	const [replyText, setReplyText] = useState("");
	const postId =
		typeof comment.post === "string"
			? comment.post
			: comment.post?._id;

	const {
		data: repliesData,
		isLoading,
	} = useQuery({
		queryKey: ["replies", comment._id],
		queryFn: () => getCommentReplies(comment._id),
		enabled: showReplies,
	});

	const createReplyMutation = useMutation({
		mutationFn: () =>
			createComment(postId, replyText.trim(), comment._id),
		onSuccess: async () => {
			setReplyText("");
			setShowReplyForm(false);
			await queryClient.invalidateQueries({
				queryKey: ["replies", comment._id],
			});
			await queryClient.invalidateQueries({
				queryKey: ["comments", postId],
			});
		},
		onError: (error) => {
			toast.error(
				error.response?.data?.message ||
					"Failed to add reply"
			);
		},
	});

	const handleCreateReply = (e) => {
		e.preventDefault();

		if (!replyText.trim() || !postId) return;

		createReplyMutation.mutate();
	};

	return (
		<div className="py-3">
			{/* Comment */}
			<div className="flex items-start gap-3">
				<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-black">
					{comment.user?.name
						?.charAt(0)
						.toUpperCase()}
				</div>

				<div className="min-w-0 flex-1">
					<p className="text-sm font-semibold">
						{comment.user?.username}
					</p>

					{comment.isDeleted ? (
						<p className="mt-1 text-sm italic text-white/30">
							This comment was deleted.
						</p>
					) : (
						<p className="mt-1 text-sm text-white/80">
							{comment.text}
						</p>
					)}

					<div className="mt-2 flex items-center gap-4 text-xs text-white/40">
						<button type="button">
							{comment.isLiked ? "♥" : "♡"}{" "}
							{comment.likes?.length || 0}
						</button>

						<button
							type="button"
							onClick={() => setShowReplyForm((prev) => !prev)}
							className="hover:text-white"
							disabled={comment.isDeleted}
						>
							Reply
						</button>

						{comment.repliesCount > 0 && (
							<button
								type="button"
								onClick={() =>
									setShowReplies(
										(prev) => !prev
									)
								}
								className="hover:text-white"
							>
								{showReplies
									? "Hide replies"
									: `${comment.repliesCount} replies`}
							</button>
						)}
					</div>

					{showReplyForm && !comment.isDeleted && (
						<form
							onSubmit={handleCreateReply}
							className="mt-3"
						>
							<div className="flex gap-2">
								<input
									type="text"
									value={replyText}
									onChange={(e) =>
										setReplyText(e.target.value)
									}
									placeholder="Write a reply..."
									className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
									autoFocus
								/>
								<button
									type="submit"
									disabled={
										createReplyMutation.isPending ||
										!replyText.trim()
									}
									className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
								>
									{createReplyMutation.isPending
										? "Sending..."
										: "Reply"}
								</button>
							</div>
						</form>
					)}
				</div>
			</div>

			{/* Replies */}
			{showReplies && (
				<div className="ml-11 mt-2 border-l border-white/10 pl-4">
					{isLoading && (
						<p className="py-2 text-xs text-white/40">
							Loading replies...
						</p>
					)}

					{repliesData?.replies?.map((reply) => (
						<div
							key={reply._id}
							className="py-2"
						>
							<p className="text-xs font-semibold">
								{reply.user?.username}
							</p>

							{reply.isDeleted ? (
								<p className="mt-1 text-sm italic text-white/30">
									This comment was deleted.
								</p>
							) : (
								<p className="mt-1 text-sm text-white/80">
									{reply.text}
								</p>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default CommentItem;