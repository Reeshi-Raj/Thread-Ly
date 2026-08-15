import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";

import { getMe } from "../services/auth.service";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const {
		data,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["me"],
		queryFn: getMe,
		retry: false,
	});

	const user = data?.user ?? null;

	return (
		<AuthContext.Provider
			value={{
				user,
				isLoading,
				isError,
				isAuthenticated: !!user,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error(
			"useAuth must be used inside AuthProvider"
		);
	}

	return context;
};