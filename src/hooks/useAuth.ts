import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi, tokenService, userService } from "../services/auth.service";
import type { LoginRequest, RegisterRequest, User } from "../types/auth.types";

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await authApi.login(credentials);
      console.log("Login response user:", response);
      return response;
    },
    onSuccess: (user: User) => {
      userService.saveUser(user);
      navigate("/dashboard");
    },
  });
};
export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (userData: RegisterRequest) => {
      const response = await authApi.register(userData);
      return response;
    },
    onSuccess: (user: User) => {
      userService.saveUser(user);
      navigate("/dashboard");
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      userService.removeUser();
      navigate("/login");
    },
  });
};

export const useAuthVerification = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["auth", "verify"],
    queryFn: tokenService.isAuthenticated,
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: options?.enabled ?? true, // Allow disabling
  });
};
