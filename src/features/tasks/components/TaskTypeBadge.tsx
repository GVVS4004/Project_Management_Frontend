import { TaskType } from "../types/task.types";

const TYPE_CONFIG: Record<TaskType, { bg:string; text: string }> = {
    [TaskType.STORY]: { bg: 'bg-green-100', text: 'text-green-800' },
    [TaskType.BUG]: { bg: 'bg-red-100', text: 'text-red-800' },
    [TaskType.DEFECT]: { bg: 'bg-orange-100', text: 'text-orange-800' },
    [TaskType.EPIC]: { bg: 'bg-purple-100', text: 'text-purple-800' },
    [TaskType.TASK]: { bg: 'bg-blue-100', text: 'text-blue-800' },
    [TaskType.SUBTASK]: { bg: 'bg-gray-100', text: 'text-gray-800' },
};

interface TaskTypeBadgeProps {
    type: TaskType;
}

const TaskTypeBadge = ({ type }: TaskTypeBadgeProps) => {
    const config = TYPE_CONFIG[type];

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
            {type.replace('_', ' ')}
        </span>
    );
};

export default TaskTypeBadge;