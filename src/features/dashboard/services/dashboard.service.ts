import apiClient from "../../../services/api.service";
import type {
  MyStats,
  ProjectStats,
  TrendData,
} from "../types/dashboard.types";
import type { ApiResponse } from "../../../types/auth.types";

export const dashboardApi = {
  getMyStats: async (): Promise<MyStats> => {
    const response = await apiClient.get<ApiResponse<MyStats>>(
      "/dashboard/my-stats",
    );
    return response.data.data;
  },

  getProjectStats: async (): Promise<ProjectStats[]> => {
    const response = await apiClient.get<ApiResponse<ProjectStats[]>>(
      "/dashboard/project-stats",
    );
    return response.data.data;
  },

  getTrends: async (days: number = 30): Promise<TrendData> => {
    const response = await apiClient.get<ApiResponse<TrendData>>(
      "/dashboard/trends",
      {
        params: { days },
      },
    );
    return response.data.data;
  },
};
