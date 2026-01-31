import axios from "axios";
import { config } from "../config/env";

/**
 * Base API client with axios
 * Used by all feature services (projects, tasks, etc.)
 */
const apiClient = axios.create({
  baseURL: config.api.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Send cookies for authentication
});

/**
 * Response interceptor
 * Handles token refresh on 401 errors
 */
apiClient.interceptors.response.use(
  (response) => response, // Success - pass through
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh for public endpoints (login, register)
    const isPublicEndpoint = originalRequest.url?.includes('/auth/login') ||
                             originalRequest.url?.includes('/auth/register') ||
                             originalRequest.url?.includes('/auth/refresh');

    // If 401 and haven't retried yet, and not a public endpoint, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry && !isPublicEndpoint) {
      originalRequest._retry = true;

      // Check if user exists in localStorage (if not, no point trying to refresh)
      const user = localStorage.getItem("user");
      if (!user) {
        // No user in localStorage, redirect to login
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        // Refresh token endpoint
        await axios.post(
          `${config.api.baseUrl}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - redirect to login
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
