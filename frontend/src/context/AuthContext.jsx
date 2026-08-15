import { createContext, useContext } from "react";
import { useQuery,useQueryClient,useMutation } from "@tanstack/react-query";

import { getMe , logoutUser} from "../services/auth.service";

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

	const queryClient = useQueryClient();

	const logoutMutation = useMutation({
		mutationFn: logoutUser,

		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["me"],
			});
		},
	});

	return (
		<AuthContext.Provider
			value={{
				user,
				isLoading,
				isError,
				isAuthenticated: !!user,
				logout: logoutMutation.mutate,
				isLoggingOut: logoutMutation.isPending,
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