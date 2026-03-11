import apiClient from "../../../services/api.service";
import type {
    Task,
    CreateTaskRequest,
    UpdateTaskRequest,
    TaskStatus,
    TaskPriority,
    ApiResponse,
    PagedResponse
} from '../types/task.types';

export interface GetTasksParams {
    page?: number;
    size?: number;
    taskTypes?: string[]; // Optional filter by task types
}

export const taskApi = {

    getTasksByProject: async(projectId: number, params: GetTasksParams = {}): Promise<PagedResponse<Task>> => {

        const { page = 0, size = 100, taskTypes } = params;
        const response = await apiClient.get<ApiResponse<PagedResponse<Task>>>(`/tasks/project/${projectId}`, {
            params: { page, size, types: taskTypes?.join(',') }
        });
        return response.data.data;
    },

    getMyTasks: async(params: GetTasksParams = {}): Promise<PagedResponse<Task>> => {
        const { page = 0, size = 100 } = params;
        const response = await apiClient.get<ApiResponse<PagedResponse<Task>>>('/tasks/my', {
            params: { page, size }
        });
        return response.data.data;
    },

    getTaskById: async(taskId: number): Promise<Task> => {
        const response = await apiClient.get<ApiResponse<Task>>(`/tasks/${taskId}`);
        return response.data.data;
    },

    searchTasks: async(query: string, params: GetTasksParams = {}): Promise<PagedResponse<Task>> => {
        const { page = 0, size = 100 } = params;
        const response = await apiClient.get<ApiResponse<PagedResponse<Task>>>(`/tasks/search`, {
            params: { query, page, size }
        });
        return response.data.data;
    },

    getTasksByStatus: async(status: TaskStatus, params: GetTasksParams = {}): Promise<PagedResponse<Task>> => {
        const { page = 0, size = 100 } = params;
        const response = await apiClient.get<ApiResponse<PagedResponse<Task>>>(`/tasks/status/${status}`, {
            params: { page, size }
        });
        return response.data.data;
    },

    getTasksByPriority: async(priority: TaskPriority, params: GetTasksParams = {}): Promise<PagedResponse<Task>> => {
        const { page = 0, size = 100 } = params;
        const response = await apiClient.get<ApiResponse<PagedResponse<Task>>>(`/tasks/priority/${priority}`, {
            params: { page, size }
        });
        return response.data.data;
    },

    getTasksByProjectAndStatus: async(projectId: number, status: TaskStatus, params: GetTasksParams = {}): Promise<PagedResponse<Task>> => {
        const { page = 0, size = 100 } = params;
        const response = await apiClient.get<ApiResponse<PagedResponse<Task>>>(`/tasks/project/${projectId}/status/${status}`, {
            params: { page, size }
        });
        return response.data.data;
    },

    createTask: async(data: CreateTaskRequest): Promise<Task> => {
        const response = await apiClient.post<ApiResponse<Task>>('/tasks', data);
        return response.data.data;
    },

    updateTask: async(taskId: number, data: UpdateTaskRequest): Promise<Task> => {
        const response = await apiClient.put<ApiResponse<Task>>(`/tasks/${taskId}`, data);
        return response.data.data;
    },

    deleteTask: async(taskId: number): Promise<void> => {
        await apiClient.delete(`/tasks/${taskId}`);
    },

    updateTaskStatus: async(taskId: number, status: TaskStatus): Promise<Task> => {
        const response = await apiClient.patch<ApiResponse<Task>>(`/tasks/${taskId}/status`, null, { params: { status } });
        return response.data.data;
    },

    assignTask: async(taskId: number, userId: number | null): Promise<Task> => {
        const response = await apiClient.patch<ApiResponse<Task>>(`/tasks/${taskId}/assign`,null ,{ params: { userId } });
        return response.data.data;
    },

    unassignTask: async(taskId: number): Promise<Task> => {
        const response = await apiClient.patch<ApiResponse<Task>>(`/tasks/${taskId}/unassign`);
        return response.data.data;
    }
};