import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { projectApi, type GetProjectsParams } from "../services/project.service";
import type { AddMemberRequest, ProjectRole, ProjectStatus, UpdateMemberRoleRequest, UpdateProjectRequest } from "../types/project.types";

export const projectKeys = {
    all: ['projects'] as const,
    list: (params?: GetProjectsParams) => [ ...projectKeys.all, 'list', params] as const,
    my: (params?: GetProjectsParams) => [ ...projectKeys.all, 'my', params] as const,
    details: (projectId: number) => [ ...projectKeys.all, 'detail', projectId] as const,
    search: (query: string) => [ ...projectKeys.all, 'search', query] as const,
    filter: (status: string) => [ ...projectKeys.all, 'filter', status] as const,
    members: (projectId: number) => [ ...projectKeys.all, 'members', projectId ] as const,
};

export const useProjects = (params?: GetProjectsParams) => {
    return useQuery({
        queryKey: projectKeys.list(params),
        queryFn: () => projectApi.getAllProjects(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Custom hook for fetching projects with infinite scroll/pagination support.
 * 
 * This hook uses React Query's `useInfiniteQuery` to manage paginated project data.
 * It automatically handles fetching subsequent pages and caching the results.
 * 
 * @param {Omit<GetProjectsParams, 'page'>} params - Query parameters for filtering/searching projects.
 * The 'page' parameter is omitted as pagination is handled internally by the hook.
 * Defaults to an empty object if not provided.
 * 
 * @returns {UseInfiniteQueryResult} Returns a React Query infinite query result object containing:
 * - `data`: Object with `pages` array containing all fetched pages and `pageParams` array
 * - `fetchNextPage`: Function to fetch the next page of results
 * - `hasNextPage`: Boolean indicating if more pages are available
 * - `isFetchingNextPage`: Boolean indicating if next page is currently being fetched
 * - `isLoading`: Boolean indicating initial loading state
 * - `isError`: Boolean indicating if an error occurred
 * - `error`: Error object if request failed
 * - Other standard React Query properties
 * 
 * @example
 * ```typescript
 * const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteProjects({ 
 *   status: 'active',
 *   search: 'project name' 
 * });
 * ```
 * 
 * @remarks
 * - Query results are cached for 5 minutes (staleTime)
 * - Pagination starts at page 0
 * - Automatically stops fetching when `lastPage.last` is true
 */
export const useInfiniteProjects = (params: Omit<GetProjectsParams, 'page'> = {}) => {
    return useInfiniteQuery({
        queryKey: projectKeys.list(params),
        queryFn: ({ pageParam = 0 }) => projectApi.getAllProjects({ ...params, page: pageParam }),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.last) return undefined;
            return allPages.length;
        },
        staleTime: 5 * 60 * 1000,
    });
}

export const useMyProjects = (params?: GetProjectsParams) => {
    return useQuery({
        queryKey: projectKeys.my(params),
        queryFn: () => projectApi.getMyProjects(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export const useProjectById = (projectId: number) => {
    return useQuery({
        queryKey: projectKeys.details(projectId),
        queryFn: () => projectApi.getProjectById(projectId.toString()),
        staleTime: 5 * 60 * 1000, // 5 minutes    
    });
}

export const useSearchProjects = (query: string, params?: GetProjectsParams) => {
    return useQuery({
        queryKey: projectKeys.search(query),
        queryFn: () => projectApi.searchByName(query, params),
        enabled: query.length > 0, // Only run if query is not empty
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export const useFilterProjectsByStatus = (status: string, params?: GetProjectsParams) => {
    return useQuery({
        queryKey: projectKeys.filter(status),
        queryFn: () => projectApi.filterByStatus(status as ProjectStatus, params),
        enabled: status !== 'ALL', // Only run if status is not 'ALL'
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export const useCreateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: projectApi.createProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: projectKeys.all });
        }
    });
}

  export const useUpdateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ projectId, data }: { projectId: number; data: UpdateProjectRequest }) =>
        projectApi.updateProject(projectId, data),
      onSuccess: (updatedProject) => {
        // Invalidate all project queries
        queryClient.invalidateQueries({ queryKey: projectKeys.all });

        // Optionally update the specific project in cache
        queryClient.setQueryData(
            projectKeys.details(updatedProject.id),
            updatedProject
        );
      },
    });
  };

  
  /**
   * Hook to delete a project
   * Usage:
   *   const deleteMutation = useDeleteProject();
   *   deleteMutation.mutate(projectId);
   */
  export const useDeleteProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (projectId: number) => projectApi.deleteProject(projectId),
      onSuccess: () => {
        // Invalidate all project queries
        queryClient.invalidateQueries({ queryKey: projectKeys.all });
      },
    });
  };

  export const useUpdateProjectStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({projectId, status}: {projectId: number, status: ProjectStatus}) => 
            projectApi.updateProjectStatus(projectId, status),
        onSuccess: (updatedProject) => {
            // Invalidate all project queries
            queryClient.invalidateQueries({ queryKey: projectKeys.all });
            // Optionally update the specific project in cache
            queryClient.setQueryData(
                projectKeys.details(updatedProject.id),
                updatedProject
            );
        },
    });
  }

  /**
   * Hook to fetch all members of a project
   * Usage:
   *   const { data: members, isLoading } = useMembers(projectId);
   *   const { data: members } = useMembers(projectId, { enabled: !!project });
   */
  export const useMembers = (projectId: number, options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: projectKeys.members(projectId),
        queryFn: () => projectApi.getMembers(projectId),
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: options?.enabled !== false, // Default to true if not specified
    });
}

/**
 * Hook to add a member to a project
 * Usage:
 *   const addMemberMutation = useAddMember();
 *   addMemberMutation.mutate({ projectId: 1, data: { userId: 2, role: ProjectRole.MEMBER } });
 */
export const useAddMember = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ projectId, data }: { projectId: number; data: AddMemberRequest }) =>
            projectApi.addMember(projectId, data),
        onSuccess: (_, variables) => {
            // Invalidate the member list for the specific project
            queryClient.invalidateQueries({ queryKey: projectKeys.members(variables.projectId) });
        }
    });
}

/**
 * Hook to update a member's role in a project
 * Usage:
 *   const updateRoleMutation = useUpdateMemberRole();
 *   updateRoleMutation.mutate({ projectId: 1, userId: 2, data: { role: ProjectRole.ADMIN } });
 */
export const useUpdateMemberRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ projectId, userId, data }: { projectId: number; userId: number; data: UpdateMemberRoleRequest }) =>
            projectApi.updateMemberRole(projectId, userId, data),
        onSuccess: (_, variables) => {
            // Invalidate the member list for the specific project
            queryClient.invalidateQueries({ queryKey: projectKeys.members(variables.projectId) });
        }
    });
}

/**
 * Hook to remove a member from a project
 * Usage:
 *   const removeMemberMutation = useRemoveMember();
 *   removeMemberMutation.mutate({ projectId: 1, userId: 2 });
 */
export const useRemoveMember = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ projectId, userId }: { projectId: number; userId: number }) =>
            projectApi.removeMember(projectId, userId),
        onSuccess: (_, variables) => {
            // Invalidate the member list for the specific project
            queryClient.invalidateQueries({ queryKey: projectKeys.members(variables.projectId) });
        }
    });
}  