 import apiClient from "../../../services/api.service";
  import type { ApiResponse } from "../../projects/types/project.types";
  import type { Attachment } from "../types/attachment.types";

  export const attachmentApi = {
    getAttachments: async (taskId: number): Promise<Attachment[]> => {
      const response = await apiClient.get<ApiResponse<Attachment[]>>(
        `/tasks/${taskId}/attachments`
      );
      return response.data.data;
    },

    uploadAttachment: async (taskId: number, file: File): Promise<Attachment> => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await apiClient.post<ApiResponse<Attachment>>(
        `/tasks/${taskId}/attachments`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response.data.data;
    },

    getDownloadUrl: async (attachmentId: number): Promise<string> => {
      const response = await apiClient.get<ApiResponse<string>>(
        `/tasks/attachments/${attachmentId}/download`
      );
      return response.data.data;
    },

    deleteAttachment: async (attachmentId: number): Promise<void> => {
      await apiClient.delete(`/tasks/attachments/${attachmentId}`);
    },
  };