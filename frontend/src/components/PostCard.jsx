import { Link } from "react-router-dom";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiTrash2,
} from "react-icons/fi";

import { deletePost, toggleLike } from "../services/post.service";
import { getMe } from "../services/auth.service";
import { getPostComments, createComment } from "../services/comment.service";
import { useEffect, useRef, useState } from "react";
import CommentItem from "./CommentItem";

const PostCard = ({ post, targetPostId, targetCommentId }) => {
  const queryClient = useQueryClient();
  const postRef = useRef(null);

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: async (data) => {
      toast.success(data.message || "Post deleted successfully");
      await queryClient.invalidateQueries({ queryKey: ["feed"] });
      await queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete post");
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
  const isOwner = currentUserId === post.user?._id;

  const likeMutation = useMutation({
    mutationFn: toggleLike,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["feed"] });
      await queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to like post");
    },
  });

  const handleLike = () => {
    if (post.isDeleted) return;
    likeMutation.mutate(post._id);
  };

  const isLiked = post.likes?.some(
    (id) => id.toString() === currentUserId?.toString()
  );

  const [showComments, setShowComments] = useState(false);
  const isTargetPost = targetPostId === post._id;

  useEffect(() => {
    if (isTargetPost && targetCommentId) {
      setShowComments(true);
    }
  }, [isTargetPost, targetCommentId]);

  const {
    data: commentsData,
    isLoading: commentsLoading,
    isError: commentsError,
  } = useQuery({
    queryKey: ["comments", post._id],
    queryFn: () => getPostComments(post._id),
    enabled: showComments,
  });

  useEffect(() => {
    if (!isTargetPost) return;

    const timer = setTimeout(() => {
      postRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      if (targetCommentId) {
        const targetNode = document.querySelector(
          `[data-comment-id="${targetCommentId}"], [data-reply-id="${targetCommentId}"]`
        );

        if (targetNode) {
          targetNode.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          targetNode.classList.add("ring-2", "ring-white/50", "rounded-lg");

          setTimeout(() => {
            targetNode.classList.remove("ring-2", "ring-white/50", "rounded-lg");
          }, 2000);
        }
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [isTargetPost, targetCommentId, showComments, commentsData]);

  const [commentText, setCommentText] = useState("");
  const createCommentMutation = useMutation({
    mutationFn: () => createComment(post._id, commentText.trim()),
    onSuccess: async () => {
      setCommentText("");
      await queryClient.invalidateQueries({ queryKey: ["comments", post._id] });
      await queryClient.invalidateQueries({ queryKey: ["feed"] });
      await queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create comment");
    },
  });

  const handleCreateComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    createCommentMutation.mutate();
  };

  if (post.isDeleted) {
    return (
      <article className="border-b border-white/10 px-4 py-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white/40">
            {post.user?.name?.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white/50">{post.user?.username}</span>
              <span className="text-sm text-white/30">· {post.createdAt}</span>
            </div>

            <div className="mt-3 rounded-xl border border-white/10 bg-white/3 px-4 py-4">
              <p className="text-sm italic text-white/40">This post was deleted.</p>
            </div>

            <div className="mt-4 text-sm text-white/40">💬 {post.comments?.length || 0}</div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article ref={postRef} className="border-b border-white/10 px-4 py-5">
      <div className="rounded-3xl border border-white/10 bg-white/2 p-4 shadow-[0_14px_28px_rgba(0,0,0,0.16)] transition hover:border-white/15">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-white to-white/80 text-sm font-bold text-black shadow-[0_8px_18px_rgba(255,255,255,0.12)]">
            {post.user?.name?.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Link
                to={`/profile/${post.user?.username}`}
                className="font-semibold text-white hover:underline"
              >
                {post.user?.username}
              </Link>
              <span className="text-sm text-white/40">· {post.createdAt}</span>
            </div>

            <p className="mt-2 whitespace-pre-wrap text-[15px] leading-7 text-white/90">
              {post.text}
            </p>

            {post.image?.url && (
              <div className="mt-4 overflow-hidden rounded-[22px] border border-white/10 bg-black/30 shadow-[0_18px_30px_rgba(0,0,0,0.2)]">
                <img
                  src={post.image.url}
                  alt="Post"
                  className="max-h-150 w-full object-cover"
                />
              </div>
            )}

            <div className="mt-4 flex items-center gap-3 text-sm text-white/50">
              <button
                type="button"
                onClick={handleLike}
                disabled={likeMutation.isPending}
                className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/2 px-3 py-1.5 transition ${
                  isLiked
                    ? "border-white/20 bg-white/10 text-white"
                    : "text-white/60 hover:border-white/20 hover:text-white"
                }`}
              >
                <FiHeart className={isLiked ? "fill-current text-white" : "text-white/70"} />
                <span>{post.likes?.length || 0}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowComments((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/2 px-3 py-1.5 text-white/60 transition hover:border-white/20 hover:text-white"
              >
                <FiMessageCircle className="text-base" />
                <span>{post.comments?.length || 0}</span>
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/2 px-3 py-1.5 text-white/60 transition hover:border-white/20 hover:text-white"
              >
                <FiShare2 className="text-base" />
                <span>Share</span>
              </button>

              {isOwner && !post.isDeleted && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-red-300 transition hover:border-red-400/40 hover:text-red-200 disabled:opacity-50"
                >
                  <FiTrash2 className="text-base" />
                  <span>{deleteMutation.isPending ? "Deleting..." : "Delete"}</span>
                </button>
              )}
            </div>

            {showComments && (
              <div className="mt-5 border-t border-white/10 pt-4">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-white/60">
                  Comments
                </h3>

                <form onSubmit={handleCreateComment} className="mb-5 flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    maxLength={500}
                    className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/2 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/35 transition focus:border-white/20 focus:bg-white/3"
                  />

                  <button
                    type="submit"
                    disabled={!commentText.trim() || createCommentMutation.isPending}
                    className="rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {createCommentMutation.isPending ? "Posting..." : "Post"}
                  </button>
                </form>

                {commentsLoading && (
                  <p className="text-sm text-white/40">Loading comments...</p>
                )}

                {commentsError && (
                  <p className="text-sm text-red-400">Failed to load comments.</p>
                )}

                {!commentsLoading && !commentsError && commentsData?.comments?.length === 0 && (
                  <p className="text-sm text-white/40">No comments yet.</p>
                )}

                {commentsData?.comments?.map((comment) => (
                  <CommentItem
                    key={comment._id}
                    comment={comment}
                    targetCommentId={targetCommentId}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
