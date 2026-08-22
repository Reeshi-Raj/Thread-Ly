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
export const createComment = async (postId, text) => {
	const response = await api.post(
		`/comments/post/${postId}`,
		{ text }
	);

	return response.data;
};
export const deleteComment = async (commentId) => {
	const response = await api.delete(
		`/comments/${commentId}`
	);

	return response.data;
};