import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTaskById, useDeleteTask } from "../hooks/useTasks";
import TaskDetailHeader from "../components/TaskDetailHeader";
import TaskDetailSidebar from "./TaskDetailSidebar";
import CommentList from "../components/CommentList";
import TaskFormModal from "../components/TaskFormModal";

import { useUserProfile } from "../../../hooks/useUser";
import DeleteConfirmModal from "./DeleteConfirmModal";
import AttachmentSection from "./AttachmentSection";
import RichTextContent from "../../../components/editor/RichTextContent";

const TaskDetailsPage = () => {
  const { taskId, projectId } = useParams<{ taskId: string; projectId: string }>();
  const navigate = useNavigate();
  const taskIdNumber = Number(taskId);

  const { data: task, isLoading, isError } = useTaskById(taskIdNumber);
  const deleteMutation = useDeleteTask();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: currentUser } = useUserProfile();
  const currentUserId = currentUser?.id ?? 0;

  const handleDelete = async () => {
    if (!task) return;
    await deleteMutation.mutateAsync({
      taskId: task.id,
      projectId: task.projectId,
    });
    navigate(`/projects/${task.projectId}/tasks`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (isError || !task) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-600 mb-2">Task not found or failed to load.</p>
        <button
          onClick={() => navigate(`/projects/${projectId}/tasks`)}
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          ← Back to Tasks
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <TaskDetailHeader
        task={task}
        onEdit={() => setIsEditModalOpen(true)}
        onDelete={() => setIsDeleteModalOpen(true)}
      />

      {/* Content + Sidebar */}
      <div className="flex gap-6">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Description */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Description
            </h3>
            {task.description ? (
              <RichTextContent
                content={task.description}
                className="text-sm text-gray-700"
              />
            ) : (
              <p className="text-sm text-gray-400 italic">
                No description provided.
              </p>
            )}
          </div>
          <AttachmentSection taskId={task.id} currentUserId={currentUserId} />
          {/* Comments */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <CommentList taskId={task.id} currentUserId={currentUserId} />
          </div>
        </div>

        {/* Sidebar */}
        <TaskDetailSidebar task={task} />
      </div>

      {/* Edit Modal */}
      <TaskFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        projectId={task.projectId}
        task={task}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        taskTitle={task.title}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};

export default TaskDetailsPage;
