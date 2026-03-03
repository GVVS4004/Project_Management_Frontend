import apiClient from "../../../services/api.service"
import type { Comment, CreateCommentRequest } from "../types/comment.types";
import type { ApiResponse } from "../types/task.types";

export const commentApi = {
    getComments: async (taskId: number): Promise<Comment[]> => {
        const response = await apiClient.get<ApiResponse<Comment[]>>(`/tasks/${taskId}/comments`);
        return response.data.data;
    },

    getCommentById: async (commentId: number): Promise<Comment> => {
        const response = await apiClient.get<ApiResponse<Comment>>(`/tasks/comments/${commentId}`);
        return response.data.data;
    },

    createComment: async (taskId: number, data: CreateCommentRequest): Promise<Comment> => {
        const response = await apiClient.post<ApiResponse<Comment>>(`/tasks/${taskId}/comments`, data);
        return response.data.data;
    },

    updateComment: async (taskId:number, commentId: number, data: { content: string }): Promise<Comment> => {
        const response = await apiClient.put<ApiResponse<Comment>>(`/tasks/${taskId}/comments/${commentId}`, data);
        return response.data.data;
    },

    deleteComment: async (taskId:number, commentId: number): Promise<void> => {
        await apiClient.delete(`/tasks/${taskId}/comments/${commentId}`);
    }
}