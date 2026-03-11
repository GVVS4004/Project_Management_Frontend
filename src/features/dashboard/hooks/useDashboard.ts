import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../services/dashboard.service";

const dashboardKeys = {
  myStats: ["dashboard", "my-stats"] as const,
  projectStats: ["dashboard", "project-stats"] as const,
  trends: (days: number) => ["dashboard", "trends", days] as const,
};

export const useMyStats = () => {
  return useQuery({
    queryKey: dashboardKeys.myStats,
    queryFn: dashboardApi.getMyStats,
    staleTime: 5 * 60 * 1000,
  });
};

export const useProjectStats = () => {
  return useQuery({
    queryKey: dashboardKeys.projectStats,
    queryFn: dashboardApi.getProjectStats,
    staleTime: 5 * 60 * 1000,
  });
};

export const useTrends = (days: number = 30) => {
  return useQuery({
    queryKey: dashboardKeys.trends(days),
    queryFn: () => dashboardApi.getTrends(days),
    staleTime: 5 * 60 * 1000,
  });
};
