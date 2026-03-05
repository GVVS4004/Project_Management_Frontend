import apiClient from "../../../services/api.service";

import type { Notification } from "../types/notification.types";

import type { ApiResponse } from "../../../types/auth.types";

export const notificationApi = {

    getAll: async (): Promise<Notification[]> => {
        const response = await apiClient.get<ApiResponse<Notification[]>>("/notifications");
        return response.data.data;
    },

    getUnread: async (): Promise<Notification[]> => {
        const response = await apiClient.get<ApiResponse<Notification[]>>("/notifications/unread");
        return response.data.data;
    },

    markAsRead: async (notificationId: number): Promise<number> => {
        const response = await apiClient.patch<ApiResponse<number>>(`/notifications/${notificationId}/read`);
        return response.data.data;
    },

    getUnreadCount: async (): Promise<number> => {
        const response = await apiClient.get<ApiResponse<number>>("/notifications/unread/count");
        return response.data.data;
    },

    markAllAsRead: async (): Promise<number> => {
        const response = await apiClient.patch<ApiResponse<number>>("/notifications/read");
        return response.data.data;
    },

    deleteNotification: async (notificationId: number): Promise<void> => {
        await apiClient.delete(`/notifications/${notificationId}`);
    },
};