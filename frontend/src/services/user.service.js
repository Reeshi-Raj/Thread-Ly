import api from "../lib/axios";

export const getUserProfile = async (username) => {
	const response = await api.get(
		`/users/profile/${username}`
	);

	return response.data;
};
export const updateProfile = async (formData) => {
	const response = await api.put(
		"/users/update",
		formData,
		{
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}
	);

	return response.data;
};
export const updatePassword = async (passwordData) => {
	const response = await api.put(
		"/users/update-password",
		passwordData
	);

	return response.data;
};
export const followUser = async (userId) => {
	const response = await api.post(
		`/users/follow/${userId}`
	);

	return response.data;
};

export const unfollowUser = async (userId) => {
	const response = await api.post(
		`/users/unfollow/${userId}`
	);

	return response.data;
};