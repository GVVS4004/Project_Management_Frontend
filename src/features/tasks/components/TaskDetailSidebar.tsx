import type { Task } from "../types/task.types";
import TaskStatusBadge from "./TaskStatusBadge";
import TaskPriorityBadge from "./TaskPriorityBadge";
import TaskTypeBadge from "./TaskTypeBadge";
import Avatar from "../../../components/Avatar";

interface TaskDetailSidebarProps {
  task: Task;
}

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const TaskDetailSidebar = ({ task }: TaskDetailSidebarProps) => {
  const isOverdue =
    task.dueDate && !task.completedAt && new Date(task.dueDate) < new Date();

  return (
    <div className="w-80 shrink-0 bg-white rounded-lg border border-gray-200 p-5 space-y-4 h-fit">
      <h3 className="text-sm font-semibold text-gray-900">Details</h3>

      <SidebarRow label="Status">
        <TaskStatusBadge status={task.status} />
      </SidebarRow>

      <SidebarRow label="Priority">
        <TaskPriorityBadge priority={task.priority} />
      </SidebarRow>

      <SidebarRow label="Type">
        <TaskTypeBadge type={task.type} />
      </SidebarRow>

      <SidebarRow label="Assignee">
        {task.assignedTo ? (
          <div className="flex items-center gap-2">
            <Avatar
              src={task.assignedTo.profileImageUrl ?? ""}
              alt={`${task.assignedTo.firstName} ${task.assignedTo.lastName}`}
            />
            <span className="text-sm text-gray-900">
              {task.assignedTo.firstName} {task.assignedTo.lastName}
            </span>
          </div>
        ) : (
          <span className="text-sm text-gray-400 italic">Unassigned</span>
        )}
      </SidebarRow>
      <SidebarRow label="CreatedBy">
        <div className="flex items-center gap-2">
          <Avatar
            src={task.createdBy.profileImageUrl ?? ""}
            alt={`${task.createdBy.firstName} ${task.createdBy.lastName}`}
          />
          <span className="text-sm text-gray-900">
            {task.createdBy.firstName} {task.createdBy.lastName}
          </span>
        </div>
      </SidebarRow>

      <SidebarRow label="Project">
        <span className="text-sm text-gray-900">{task.projectName}</span>
      </SidebarRow>

      <SidebarRow label="Due Date">
        <span
          className={`text-sm ${isOverdue ? "text-red-600 font-medium" : "text-gray-900"}`}
        >
          {formatDate(task.dueDate)}
        </span>
      </SidebarRow>

      {task.completedAt && (
        <SidebarRow label="Completed">
          <span className="text-sm text-green-600">
            {formatDate(task.completedAt)}
          </span>
        </SidebarRow>
      )}

      <SidebarRow label="Created">
        <span className="text-sm text-gray-500">
          {formatDate(task.createdAt)}
        </span>
      </SidebarRow>

      <SidebarRow label="Updated">
        <span className="text-sm text-gray-500">
          {formatDate(task.updatedAt)}
        </span>
      </SidebarRow>
    </div>
  );
};

const SidebarRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-gray-500">{label}</span>
    {children}
  </div>
);

export default TaskDetailSidebar;
