import apiClient from "../../../services/api.service";
import { type CreateProjectRequest, type Project, type ProjectStatus, type PagedResponse, type ProjectMember } from "../types/project.types";
import type { AddMemberRequest, ApiResponse, UpdateMemberRoleRequest } from '../types/project.types';
import type { UpdateProjectRequest } from '../types/project.types';

export interface GetProjectsParams {
    page?: number;
    size?: number;
    status?: ProjectStatus;
    search?: string;
}

export const projectApi = {

    getAllProjects: async (params: GetProjectsParams = {}): Promise<PagedResponse<Project>> => {
        const { page = 0, size = 20, status, search } = params;
        const response = await apiClient.get<ApiResponse<PagedResponse<Project>>>("/projects", {
            params: { page, size, ...(status && { status }), ...(search && { search }) }
        });
        return response.data.data;
    },

    getProjectById: async (projectId: string): Promise<Project> => {
        const response = await apiClient.get<ApiResponse<Project>>(`/projects/${projectId}`);
        return response.data.data;
    },

    getMyProjects: async (params: GetProjectsParams = {}): Promise<PagedResponse<Project>> => {
        const { page = 0, size = 20 } = params;
        const response = await apiClient.get<ApiResponse<PagedResponse<Project>>>("projects/my", {
            params: { page, size }
        });
        return response.data.data;
    },

    createProject: async(request: CreateProjectRequest): Promise<Project> => {
        const response = await apiClient.post<ApiResponse<Project>>("/projects", request);
        return response.data.data;
    },

    updateProject: async (projectId: number, data: UpdateProjectRequest): Promise<Project> => {
        console.log("API Service - Sending data:", data);
        console.log("API Service - Project ID:", projectId);
        const response = await apiClient.put<ApiResponse<Project>>(`/projects/${projectId}`, data);
        return response.data.data;
    },

    updateProjectStatus: async (projectId: number, status: ProjectStatus): Promise<Project> => {
        const response = await apiClient.patch<ApiResponse<Project>>(`/projects/${projectId}/status`, { status });
        return response.data.data;
    },

    deleteProject: async (projectId: number): Promise<void> => {
        await apiClient.delete(`/projects/${projectId}`);
    },

    searchByName: async (query: string, params: GetProjectsParams = {}): Promise<PagedResponse<Project>> => {
        const { page = 0, size = 20 } = params;
        const response = await apiClient.get<ApiResponse<PagedResponse<Project>>>(`/projects/search/name`, {
            params: { query, page, size }
        });
        return response.data.data;
    },

    filterByStatus: async (status: ProjectStatus, params: GetProjectsParams = {}): Promise<PagedResponse<Project>> => {
        const { page = 0, size = 20 } = params;
        const response = await apiClient.get<ApiResponse<PagedResponse<Project>>>(`/projects/filter/status`, {
            params: { status, page, size }
        });
        return response.data.data;
    },

    getMembers: async (projectId: number): Promise<ProjectMember[]> => {
        const response  = await apiClient.get<ApiResponse<ProjectMember[]>>(`/projects/${projectId}/members`);
        return response.data.data;
    },

    addMember: async(projectId: number, request: AddMemberRequest): Promise<ProjectMember> => {
        const response = await apiClient.post<ApiResponse<ProjectMember>>(`/projects/${projectId}/members`, request);
        return response.data.data;
    },

    updateMemberRole: async(projectId: number, userId: number, request: UpdateMemberRoleRequest): Promise<ProjectMember> => {
        const response = await apiClient.patch<ApiResponse<ProjectMember>>(`/projects/${projectId}/members/${userId}/role`, request);
        return response.data.data;
    },

    removeMember: async(projectId: number, userId: number): Promise<void> => {
        await apiClient.delete(`/projects/${projectId}/members/${userId}`);
    }
};