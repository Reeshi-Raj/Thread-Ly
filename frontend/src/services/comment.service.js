import api from "../lib/axios";

export const getPostComments = async (postId, page = 1, limit = 10) => {
	const response = await api.get(
		`/comments/post/${postId}`,
		{
			params: {
				page,
				limit,
			},
		}
	);

	return response.data;
};
export const createComment = async (
	postId,
	text,
	parentComment = null
) => {
	const response = await api.post(
		`/comments/post/${postId}`,
		{ text, parentComment }
	);

	return response.data;
};
export const deleteComment = async (commentId) => {
	const response = await api.delete(
		`/comments/${commentId}`
	);

	return response.data;
};
export const toggleCommentLike = async (commentId) => {
	const response = await api.post(
		`/comments/${commentId}/like`
	);

	return response.data;
};
export const getCommentReplies = async (
	commentId,
	page = 1,
	limit = 10
) => {
	const response = await api.get(
		`/comments/${commentId}/replies`,
		{
			params: {
				page,
				limit,
			},
		}
	);
	return response.data;
};