import type {
  LoginRequest,
  RegisterRequest,
  ApiResponse,
  User,
  UpdateProfileRequest,
  ChangePasswordRequest,
  MediaUploadResponse,
} from "../types/auth.types";
import apiClient from "./api.service";



export const authApi = {
  login: async (credentials: LoginRequest): Promise<User> => {
    const response = await apiClient.post<ApiResponse<User>>(
      "/auth/login",
      credentials
    );
    return response.data.data;
  },

  register: async (details: RegisterRequest): Promise<User> => {
    const response = await apiClient.post<ApiResponse<User>>(
      "/auth/register",
      details
    );
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },

  verify: async (): Promise<boolean> => {
    try {
      await apiClient.get("/auth/verify");
      return true;
    } catch {
      return false;
    }
  },
};

export const userApi = {
    getProfile: async (): Promise<User> => {
      const response = await apiClient.get<ApiResponse<User>>("/users/profile");
      return response.data.data;
    },
    updateProfile: async (profileData: UpdateProfileRequest): Promise<User> => {
      const response = await apiClient.put<ApiResponse<User>>("/users/profile", profileData);
      return response.data.data;
    },

    changePassword: async (passwordData: ChangePasswordRequest): Promise<void> => {
      await apiClient.put("/users/change-password", passwordData);
    },
    uploadProfileImage: async (file: File): Promise<MediaUploadResponse> => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await apiClient.post<ApiResponse<MediaUploadResponse>>(
          "/media/profile-image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response.data.data;
      },

      deleteProfileImage: async (): Promise<void> => {
        await apiClient.delete("/media/profile-image");
      },

      /**
       * Search users by query string
       * @param query Search term (searches username, firstName, lastName, email)
       * @param limit Maximum number of results (default 20, max 100)
       */
      searchUsers: async (query: string, limit: number = 20): Promise<User[]> => {
        const response = await apiClient.get<ApiResponse<User[]>>("/users/search", {
          params: { query, limit }
        });
        return response.data.data;
      }
    };

export const userService = {
  saveUser: (user: User) => {
    console.log("Saving user to localStorage:", user);
    localStorage.setItem("user", JSON.stringify(user));
  },

  getUser: (): User | null => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  },

  removeUser: () => {
    localStorage.removeItem("user");
  },
};

export const tokenService = {
  isAuthenticated: async (): Promise<boolean> => {
    try {
      await apiClient.get("/auth/verify");
      return true;
    } catch {
      return false;
    }
  },
};
