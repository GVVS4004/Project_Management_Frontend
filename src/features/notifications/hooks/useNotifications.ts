import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";   
import { notificationApi } from "../services/notification.service";
import { toast } from "sonner";

const notificationKeys = {
    all: ["notifications"] as const,
    unread: ["notifications", "unread"] as const,
    count: ["notifications", "unread", "count"] as const,
};

export const useNotifications = () => {
    return useQuery(
        {
            queryKey: notificationKeys.all,
            queryFn: notificationApi.getAll,
            staleTime: 5 * 60 * 1000, // 5 minutes
        }
    )
};

export const useUnreadNotifications = () => {
    return useQuery(
        {
            queryKey: notificationKeys.unread,
            queryFn: notificationApi.getUnread,
            staleTime: 5 * 60 * 1000, // 5 minutes
        }
    )
}

export const useUnreadCount = () => {
    return useQuery(
        {
            queryKey: notificationKeys.count,
            queryFn: notificationApi.getUnreadCount,
            refetchInterval: 30000, // 30 seconds
        }
    )
}

export const useMarkAsRead = () => {
    const queryClient = useQueryClient();
    return useMutation(
        {
            mutationFn: (id: number) => notificationApi.markAsRead(id),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: notificationKeys.all });
                queryClient.invalidateQueries({ queryKey: notificationKeys.unread });
                queryClient.invalidateQueries({ queryKey: notificationKeys.count });
                toast.success("Notification marked as read");
            },
        }
    )
}   

export const useMarkAllAsRead = () => {
    const queryClient = useQueryClient();
    return useMutation(
        {
            mutationFn: () => notificationApi.markAllAsRead(),
            onSuccess: (count) => {
                queryClient.invalidateQueries({ queryKey: notificationKeys.all });
                queryClient.invalidateQueries({ queryKey: notificationKeys.unread });
                queryClient.invalidateQueries({ queryKey: notificationKeys.count });
                if(count > 0) toast.success(`${count} notifications marked as read`);
            }
        }
    )
}

export const useDeleteNotification = () => {
    const queryClient = useQueryClient();
    return useMutation(
        {
            mutationFn: (id: number) => notificationApi.deleteNotification(id),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: notificationKeys.all });
                queryClient.invalidateQueries({ queryKey: notificationKeys.unread });
                queryClient.invalidateQueries({ queryKey: notificationKeys.count });
            },
        }
    )
}