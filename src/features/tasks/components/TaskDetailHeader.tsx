import { useNavigate } from "react-router-dom";
import type { Task } from "../types/task.types";
import TaskStatusBadge from "./TaskStatusBadge";
import TaskPriorityBadge from "./TaskPriorityBadge";
import TaskTypeBadge from "./TaskTypeBadge";

interface TaskDetailHeaderProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

const TaskDetailHeader = ({
  task,
  onEdit,
  onDelete,
}: TaskDetailHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      {/* Back link */}
      <button
        onClick={() => navigate("/tasks")}
        className="text-sm text-gray-500 hover:text-indigo-600 mb-4 inline-flex items-center gap-1"
      >
        ← Back to Tasks
      </button>

      {/* Type + ID */}
      <div className="flex items-center gap-2 mb-2">
        <TaskTypeBadge type={task.type} />
        <span className="text-sm text-gray-500">#{task.id}</span>
      </div>

      {/* Title + Actions */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onEdit}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1.5 text-sm border border-red-300 rounded-md text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Status + Priority badges */}
      <div className="flex items-center gap-2 mt-3">
        <TaskStatusBadge status={task.status} />
        <TaskPriorityBadge priority={task.priority} />
      </div>
    </div>
  );
};

export default TaskDetailHeader;
