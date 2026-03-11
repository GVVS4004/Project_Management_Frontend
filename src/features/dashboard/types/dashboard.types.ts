export interface MyStats {
  tasksByStatus: Record<string, number>;
  tasksByPriority: Record<string, number>;
  totalAssignedTasks: number;
  overdueTaskCount: number;
  projectsByStatus: Record<string, number>;
  totalProjects: number;
}

export interface ProjectStats {
  projectId: number;
  projectName: string;
  projectStatus: string;
  totalTasks: number;
  completedTasks: number;
  completionPercentage: number;
  overdueTaskCount: number;
  memberCount: number;
}

export interface DailyCount {
  date: string;
  count: number;
}

export interface TrendData {
  period: number;
  tasksCompleted: DailyCount[];
  tasksCreated: DailyCount[];
}
