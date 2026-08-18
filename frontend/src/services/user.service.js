import api from "../lib/axios";

export const getUserProfile = async (username) => {
	const response = await api.get(
		`/users/profile/${username}`
	);

	return response.data;
};