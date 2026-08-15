import api from "../lib/axios";

export const getMe = async () => {
	const response = await api.get("/users/me");

	return response.data;
};
export const loginUser = async (credentials) => {
	const response = await api.post("/users/login", credentials);

	return response.data;
};
export const signupUser = async (userData) => {
	const response = await api.post("/users/signup", userData);

	return response.data;
};