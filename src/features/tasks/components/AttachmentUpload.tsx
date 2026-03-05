import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { useUploadAttachment } from "../hooks/useAttachments";

interface AttachmentUploadProps {
  taskId: number;
}

const AttachmentUpload = ({ taskId }: AttachmentUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadAttachment(taskId);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      uploadMutation.mutate(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsDragging(false)}
      className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
        isDragging
          ? "border-indigo-500 bg-indigo-50"
          : "border-gray-300 hover:border-gray-400"
      }`}
    >
      {uploadMutation.isPending ? (
        <p className="text-sm text-indigo-600">Uploading...</p>
      ) : (
        <>
          <Upload size={20} className="mx-auto text-gray-400 mb-1" />
          <p className="text-sm text-gray-500">
            Drag & drop files here or{" "}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              browse
            </button>
          </p>
        </>
      )}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
};

export default AttachmentUpload;
