import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { commentApi } from "../services/comment.service";
import type { CreateCommentRequest, UpdateCommentRequest } from "../types/comment.types";


const commentKeys = {
    byTask: (taskId: number) => ["comments", "task", taskId] as const,
};

export const useComments = (taskId: number) => {
    return useQuery({
        queryKey: commentKeys.byTask(taskId),
        queryFn: () => commentApi.getComments(taskId),
        enabled: taskId > 0,
    });
};


export const useCreateComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({taskId, data}: { taskId: number, data: CreateCommentRequest }) => commentApi.createComment(taskId, data),
        onSuccess: (_newComment, variables) => {
            queryClient.invalidateQueries({ queryKey: commentKeys.byTask(variables.taskId) });
        }
    });
};

export const useUpdateComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({taskId, commentId, data}: { taskId: number, commentId: number, data: UpdateCommentRequest }) => commentApi.updateComment(taskId, commentId, data),
        onSuccess: (_updatedComment, variables) => {
            queryClient.invalidateQueries({ queryKey: commentKeys.byTask(variables.taskId) });
        }
    });
};  

export const useDeleteComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({taskId, commentId}: { taskId: number, commentId: number }) => commentApi.deleteComment(taskId, commentId),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: commentKeys.byTask(variables.taskId) });
        }
    });
}