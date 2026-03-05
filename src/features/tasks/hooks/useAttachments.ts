import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { attachmentApi } from "../services/attachment.service";
import { toast } from "sonner";

const attachmentKeys = {
  byTask: (taskId: number) => ["attachments", "task", taskId] as const,
};

export const useAttachments = (taskId: number) => {
  return useQuery({
    queryKey: attachmentKeys.byTask(taskId),
    queryFn: () => attachmentApi.getAttachments(taskId),
    enabled: !!taskId,
  });
};

export const useUploadAttachment = (taskId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => attachmentApi.uploadAttachment(taskId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: attachmentKeys.byTask(taskId),
      });
      toast.success("File uploaded successfully");
    },
    onError: () => {
      toast.error("Failed to upload file");
    },
  });
};

export const useDownloadAttachment = () => {
  return useMutation({
    mutationFn: (attachmentId: number) =>
      attachmentApi.getDownloadUrl(attachmentId),
    onSuccess: (url) => {
      window.open(url, "_blank");
    },
    onError: () => {
      toast.error("Failed to get download link");
    },
  });
};

export const useDeleteAttachment = (taskId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (attachmentId: number) =>
      attachmentApi.deleteAttachment(attachmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: attachmentKeys.byTask(taskId),
      });
      toast.success("Attachment deleted");
    },
    onError: () => {
      toast.error("Failed to delete attachment");
    },
  });
};
