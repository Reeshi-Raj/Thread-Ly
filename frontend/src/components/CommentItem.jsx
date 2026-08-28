import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { getMe } from "../services/auth.service";
import {
	createComment,
	deleteComment,
	getCommentReplies,
	toggleCommentLike,
} from "../services/comment.service";
import { useState } from "react";

const CommentItem = ({ comment }) => {
	const queryClient = useQueryClient();
	const [showReplies, setShowReplies] = useState(false);
	const [showReplyForm, setShowReplyForm] = useState(false);
	const [replyText, setReplyText] = useState("");

	const { data: meData } = useQuery({
		queryKey: ["me"],
		queryFn: getMe,
	});
	const currentUserId = meData?.user?._id;
	const isCommentOwner =
		currentUserId && comment.user?._id
			? currentUserId.toString() === comment.user._id.toString()
			: false;

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

	const toggleLikeMutation = useMutation({
		mutationFn: toggleCommentLike,
		onSuccess: async () => {
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
					"Failed to update like"
			);
		},
	});

	const handleCreateReply = (e) => {
		e.preventDefault();

		if (!replyText.trim() || !postId) return;

		createReplyMutation.mutate();
	};

	const handleToggleCommentLike = () => {
		if (comment.isDeleted) return;
		toggleLikeMutation.mutate(comment._id);
	};

	const handleToggleReplyLike = (reply) => {
		if (reply.isDeleted) return;
		toggleLikeMutation.mutate(reply._id);
	};

	const deleteCommentMutation = useMutation({
		mutationFn: (commentId) => deleteComment(commentId),
		onSuccess: async () => {
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
					"Failed to delete comment"
			);
		},
	});

	const handleDeleteComment = () => {
		if (!window.confirm("Delete this comment?")) return;
		deleteCommentMutation.mutate(comment._id);
	};

	const handleDeleteReply = (reply) => {
		if (!window.confirm("Delete this reply?")) return;
		deleteCommentMutation.mutate(reply._id);
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
						<button
							type="button"
							onClick={handleToggleCommentLike}
							disabled={toggleLikeMutation.isPending || comment.isDeleted}
							className="transition hover:text-white disabled:opacity-50"
						>
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

						{isCommentOwner && !comment.isDeleted && (
							<button
								type="button"
								onClick={handleDeleteComment}
								disabled={deleteCommentMutation.isPending}
								className="text-red-300 transition hover:text-red-200 disabled:opacity-50"
							>
								Delete
							</button>
						)}

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

							<div className="mt-2 flex items-center gap-4 text-[11px] text-white/40">
								<button
									type="button"
									onClick={() => handleToggleReplyLike(reply)}
									disabled={toggleLikeMutation.isPending || reply.isDeleted}
									className="transition hover:text-white disabled:opacity-50"
								>
									{reply.isLiked ? "♥" : "♡"}{" "}
									{reply.likes?.length || 0}
								</button>

								{meData?.user?._id && reply.user?._id && meData.user._id.toString() === reply.user._id.toString() && (
									<button
										type="button"
										onClick={() => handleDeleteReply(reply)}
										disabled={deleteCommentMutation.isPending}
										className="text-red-300 transition hover:text-red-200 disabled:opacity-50"
									>
										Delete
									</button>
								)}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default CommentItem;