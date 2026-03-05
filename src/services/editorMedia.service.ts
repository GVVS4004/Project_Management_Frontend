import apiClient from "./api.service";
import type { ApiResponse } from "../features/projects/types/project.types";
import { config } from "../config/env";

export interface EditorMediaResponse {
  id: string;
  url: string;
  contentType: string;
  fileSize: number;
}

export const editorMediaApi = {
  upload: async (file: File): Promise<EditorMediaResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<ApiResponse<EditorMediaResponse>>(
      "/media/upload",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data.data;
  },

  getFullUrl: (relativeUrl: string): string => {
    return `${config.api.baseUrl}${relativeUrl}`;
  },
};
