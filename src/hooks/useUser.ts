import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi, userService } from "../services/auth.service";
import type { ChangePasswordRequest, UpdateProfileRequest, User } from "../types/auth.types";

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: userApi.getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData: UpdateProfileRequest) =>
      userApi.updateProfile(profileData),
    onSuccess: (updateUser: User) => {
      queryClient.setQueryData(["user", "profile"], updateUser);
      userService.saveUser(updateUser);
    },
  });
};

// Mutation: Change password
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (passwordData: ChangePasswordRequest) =>
      userApi.changePassword(passwordData),
  });
};

export const useUploadProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => userApi.uploadProfileImage(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    },
  });
};

export const useDeleteProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userApi.deleteProfileImage(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    },
  });
};

/**
 * Hook to search users by query string
 * Searches across username, firstName, lastName, and email
 * Only runs when query has at least 2 characters
 *
 * @param query Search term
 * @param limit Maximum number of results (default 20)
 * @returns Query result with user list
 */
export const useSearchUsers = (query: string, limit: number = 20) => {
  return useQuery({
    queryKey: ["users", "search", query, limit],
    queryFn: () => userApi.searchUsers(query, limit),
    enabled: query.length >= 2, // Only search when at least 2 characters
    staleTime: 1 * 60 * 1000, // 1 minute (search results become stale faster)
  });
};
