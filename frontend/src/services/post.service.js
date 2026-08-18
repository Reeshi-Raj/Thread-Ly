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