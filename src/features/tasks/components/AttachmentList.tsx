import {
  FileText,
  Image,
  FileVideo,
  File,
  Download,
  Trash2,
} from "lucide-react";
import { timeAgo } from "../../../utils/timeAgo";
import {
  useDownloadAttachment,
  useDeleteAttachment,
} from "../hooks/useAttachments";
import type { Attachment } from "../types/attachment.types";

interface AttachmentListProps {
  attachments: Attachment[];
  taskId: number;
  currentUserId: number;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileIcon = (contentType: string) => {
  if (contentType.startsWith("image/")) return Image;
  if (contentType.startsWith("video/")) return FileVideo;
  if (contentType.includes("pdf") || contentType.includes("document"))
    return FileText;
  return File;
};

const AttachmentList = ({
  attachments,
  taskId,
  currentUserId,
}: AttachmentListProps) => {
  const downloadMutation = useDownloadAttachment();
  const deleteMutation = useDeleteAttachment(taskId);

  if (attachments.length === 0) return null;

  return (
    <div className="space-y-2">
      {attachments.map((attachment) => {
        const Icon = getFileIcon(attachment.contentType);
        const isUploader = attachment.uploadedBy.id === currentUserId;

        return (
          <div
            key={attachment.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 group"
          >
            <Icon size={18} className="text-gray-400 flex-shrink-0" />

            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700 truncate">
                {attachment.fileName}
              </p>
              <p className="text-xs text-gray-400">
                {formatFileSize(attachment.fileSize)} ·{" "}
                {attachment.uploadedBy.firstName}{" "}
                {attachment.uploadedBy.lastName} ·{" "}
                {timeAgo(attachment.createdAt)}
              </p>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => downloadMutation.mutate(attachment.id)}
                className="p-1 text-gray-400 hover:text-indigo-600"
                title="Download"
              >
                <Download size={16} />
              </button>
              {isUploader && (
                <button
                  onClick={() => deleteMutation.mutate(attachment.id)}
                  className="p-1 text-gray-400 hover:text-red-500"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AttachmentList;
