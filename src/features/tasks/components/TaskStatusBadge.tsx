import { TaskStatus } from "../types/task.types";

const statusConfig: Record<TaskStatus, {bg: string; text: string; label: string}> = {
    [TaskStatus.TODO]: { bg: 'bg-gray-100', text: 'text-gray-800', label:'To Do' },
    [TaskStatus.IN_PROGRESS]: { bg: 'bg-blue-100', text: 'text-blue-800', label:'In Progress' },
    [TaskStatus.BLOCKED]: { bg: 'bg-red-100', text: 'text-red-800', label:'Blocked' },
    [TaskStatus.REVIEW]: { bg: 'bg-purple-100', text: 'text-purple-800', label:'In Review' },
    [TaskStatus.TESTING]: { bg: 'bg-yellow-100', text: 'text-yellow-800', label:'Testing' },
    [TaskStatus.DONE]: { bg: 'bg-green-100', text: 'text-green-800', label:'Done' },
    [TaskStatus.ABANDONED]: { bg: 'bg-gray-200', text: 'text-gray-600', label:'Abandoned' },
};

const TaskStatusBadge = ({status} : {status: TaskStatus}) => {
    const config = statusConfig[status];

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${config.bg} ${config.text}`}>
            {config.label}
        </span>
    );
}

export default TaskStatusBadge;