import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { taskApi, type GetTasksParams } from "../services/task.service";
import type { CreateTaskRequest, Task, TaskStatus, UpdateTaskRequest, PagedResponse } from "../types/task.types";



export const taskKeys = {
    all: ['tasks'] as const,
    byProject: (projectId: number) => [...taskKeys.all, 'project', projectId] as const,
    byProjectAndTypes: (projectId: number, taskTypes?: string[]) => [...taskKeys.all, 'project', projectId, taskTypes] as const,
    my: () => [...taskKeys.all, 'my'] as const,
    detail: (taskId: number) => [...taskKeys.all, 'detail', taskId] as const,
    search: (query: string) => [...taskKeys.all, 'search', query] as const,
};

export const useTasksByProject = (projectId: number, params?: GetTasksParams) => {
    return useQuery({
        queryKey: taskKeys.byProjectAndTypes(projectId, params?.taskTypes),
        queryFn: () => taskApi.getTasksByProject(projectId, params),
        enabled: projectId > 0,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}

export const useMyTasks = (params?: GetTasksParams) => {
    return useQuery({
        queryKey: taskKeys.my(),
        queryFn: () => taskApi.getMyTasks(params),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}

export const useTaskById = (taskId: number) => {
    return useQuery({
        queryKey: taskKeys.detail(taskId),
        queryFn: () => taskApi.getTaskById(taskId),
        enabled: taskId > 0,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}

export const useSearchTasks = (query: string) => {
    return useQuery({
        queryKey: taskKeys.search(query),
        queryFn: () => taskApi.searchTasks(query),
        enabled: query.trim().length >= 2,
        staleTime: 1 * 60 * 1000, // 1 minute
    });
}

export const useCreateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateTaskRequest) => taskApi.createTask(data),
        onSuccess: (_newTask, variables) => {
            queryClient.invalidateQueries({queryKey: taskKeys.byProject(variables.projectId)});
            queryClient.invalidateQueries({queryKey: taskKeys.my()});
        }
    });
} 

export const useUpdateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({taskId, updateData}: {taskId: number, updateData: UpdateTaskRequest}) => taskApi.updateTask(taskId, updateData),
        onSuccess: (updatedTask) => {
            queryClient.invalidateQueries({queryKey: taskKeys.byProject(updatedTask.projectId)});
            queryClient.setQueryData(taskKeys.detail(updatedTask.id), updatedTask);
        },   
    });
}

export const useDeleteTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({taskId, projectId}: {taskId: number, projectId: number}) => taskApi.deleteTask(taskId),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({queryKey: taskKeys.byProject(variables.projectId)});
            queryClient.invalidateQueries({queryKey: taskKeys.my()});
        }
    })
}

export const useUpdateTaskStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({taskId, status}: { taskId: number, status: TaskStatus, projectId: number }) => taskApi.updateTaskStatus(taskId, status),

        onMutate: async ({ taskId, status, projectId }) => {

            await queryClient.cancelQueries({ queryKey: taskKeys.byProject(projectId) });

            const previousTasks = queryClient.getQueryData<PagedResponse<Task>>(taskKeys.byProject(projectId));
            
            if (previousTasks) {
                queryClient.setQueryData<PagedResponse<Task>>(taskKeys.byProject(projectId), {
                    ...previousTasks,
                    content: previousTasks.content.map(task => 
                        task.id === taskId ? { ...task, status } : task
                    )
                });
            }

            return { previousTasks };
        },

        onError: (_err, variables, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(taskKeys.byProject(variables.projectId), context.previousTasks);
            }
        },

        onSettled: (_data, _error, variables) => {
            queryClient.invalidateQueries({ queryKey: taskKeys.byProject(variables.projectId) });
        }
    });    

}

export const useAssignTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ taskId, userId }: { taskId: number; userId: number; projectId: number }) =>
        taskApi.assignTask(taskId, userId),
      onSuccess: (updatedTask) => {
        queryClient.invalidateQueries({ queryKey: taskKeys.byProject(updatedTask.projectId) });
      },
    });
};

export const useUnassignTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ taskId }: { taskId: number; projectId: number }) =>
        taskApi.unassignTask(taskId),
        onSuccess: (updatedTask) => {
        queryClient.invalidateQueries({ queryKey: taskKeys.byProject(updatedTask.projectId) });
        },
    });
};