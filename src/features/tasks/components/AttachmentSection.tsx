import { Paperclip } from "lucide-react";
import { useAttachments } from "../hooks/useAttachments";
import AttachmentUpload from "./AttachmentUpload";
import AttachmentList from "./AttachmentList";

interface AttachmentSectionProps {
  taskId: number;
  currentUserId: number;
}

const AttachmentSection = ({
  taskId,
  currentUserId,
}: AttachmentSectionProps) => {
  const { data: attachments, isLoading } = useAttachments(taskId);

  const count = attachments?.length ?? 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Paperclip size={18} className="text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900">
          Attachments{count > 0 && ` (${count})`}
        </h3>
      </div>

      <AttachmentUpload taskId={taskId} />

      {isLoading ? (
        <p className="text-sm text-gray-500 mt-3">Loading attachments...</p>
      ) : (
        attachments && (
          <div className="mt-3">
            <AttachmentList
              attachments={attachments}
              taskId={taskId}
              currentUserId={currentUserId}
            />
          </div>
        )
      )}
    </div>
  );
};

export default AttachmentSection;
