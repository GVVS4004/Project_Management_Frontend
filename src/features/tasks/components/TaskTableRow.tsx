import type { Task } from "../types/task.types";
import TaskStatusBadge from "./TaskStatusBadge";
import TaskPriorityBadge from "./TaskPriorityBadge";
import TaskTypeBadge from "./TaskTypeBadge";

interface TaskTableRowProps {
  task: Task;
  isSelected: boolean;
  onSelectToggle: (taskId: number) => void;
  onTaskClick?: (task: Task) => void;
}

const TaskTableRow = ({ task, isSelected, onSelectToggle, onTaskClick }: TaskTableRowProps) => {
    const isOverdue = task.dueDate ? new Date(task.dueDate) < new Date() && task.status !== 'DONE' && task.status !== 'ABANDONED' : false;

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
    }

    return (
        <tr className={`${isSelected ? 'bg-indigo-50' : 'hover:bg-gray-50'} transition-colors`}>
            <td className="px-4 py-3 w-10">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelectToggle(task.id)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
            </td>

            <td className="px-4 py-3 text-sm text-gray-500 w-16">
                #{task.id}
            </td>
            <td className="px-4 py-3">
                <button
                    onClick={() => onTaskClick?.(task)}
                    className="text-sm font-medium text-gray-900 hover:text-indigo-600 text-left truncate max-w-xs block"
                >
                    {task.title}
                </button>
            </td>
            <td className="px-4 py-3">
                <TaskStatusBadge status={task.status} />
            </td>

            <td className="px-4 py-3">
                <TaskPriorityBadge priority={task.priority} />
            </td>

            <td className="px-4 py-3">
                <TaskTypeBadge type={task.type} />
            </td>

            <td className="px-4 py-3 text-sm">
                {task.assignedTo ? (
                    <span className="text-gray-900">{task.assignedTo.firstName} {task.assignedTo.lastName}</span>
                ) : (
                    <span className="text-gray-500">Unassigned</span>
                )}
            </td>

            <td className={`px-4 py-3 text-sm ${isOverdue ? 'text-red-600 font-medium': 'text-gray-500'}`}>
                {formatDate(task.dueDate)}
            </td>
        </tr>
    );
};

export default TaskTableRow;

