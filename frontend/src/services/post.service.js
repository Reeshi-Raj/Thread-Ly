import api from "../lib/axios";

export const createPost = async (formData) => {
	const response = await api.post(
		"/posts/create",
		formData
	);

	return response.data;
};
export const getFeed = async (page = 1, limit = 10) => {
	const response = await api.get("/posts/feed", {
		params: {
			page,
			limit,
		},
	});

	return response.data;
};
export const getUserPosts = async (
	username,
	page = 1,
	limit = 10
) => {
	const response = await api.get(
		`/posts/user/${username}`,
		{
			params: {
				page,
				limit,
			},
		}
	);
	return response.data;
};
export const deletePost = async (postId) => {
	const response = await api.delete(`/posts/${postId}`);

	return response.data;
};
export const toggleLike = async (postId) => {
	const response = await api.post(`/posts/${postId}/like`);

	return response.data;
};