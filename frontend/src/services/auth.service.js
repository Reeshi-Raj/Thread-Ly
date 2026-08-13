import api from "../lib/axios";

export const getMe = async () => {
	const response = await api.get("/users/me");

	return response.data;
};