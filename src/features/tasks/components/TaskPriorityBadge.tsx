import { TaskPriority } from "../types/task.types";

const priorityConfig: Record<TaskPriority, { bg: string; text: string; label: string }> = {
    [TaskPriority.CRITICAL]: { bg: 'bg-red-100 border-red-300 animate-pulse', text: 'text-red-800', label:'Critical' },
    [TaskPriority.HIGH]: { bg: 'bg-orange-100 border-orange-300', text: 'text-orange-800', label:'High' },
    [TaskPriority.MEDIUM]: { bg: 'bg-yellow-100 border-blue-300', text: 'text-blue-800', label:'Medium' },
    [TaskPriority.LOW]: { bg: 'bg-green-100 border-gray-300', text: 'text-gray-800', label:'Low' },
};

const TaskPriorityBadge = ({priority} : {priority: TaskPriority}) => {
    const config = priorityConfig[priority];

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${config.bg} ${config.text}`}>
            {config.label}
        </span>
    );
}

export default TaskPriorityBadge;