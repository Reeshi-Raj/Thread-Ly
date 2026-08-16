import api from "../lib/axios";

export const createPost = async (formData) => {
	const response = await api.post(
		"/posts/create",
		formData
	);

	return response.data;
};