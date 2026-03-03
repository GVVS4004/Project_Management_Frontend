
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../types/task.types';
import TaskPriorityBadge from './TaskPriorityBadge';
import Avatar from '../../../components/Avatar';


const typeIcons: Record<string, string> = {
    STORY: '📖',
    BUG: '🐞',
    DEFECT: '⚠️',
    TASK: '✅',
    SUBTASK: '📌',
    EPIC: '⚡',
}

interface TaskCardProps {
    task: Task;
    onClick?: (task: Task) => void;
}


const TaskCard = ({task, onClick}: TaskCardProps) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const isOverdue = task.dueDate && !task.completedAt && new Date(task.dueDate) < new Date();

    const handleClick = (e: React.MouseEvent) => {
      // Only fire click if it wasn't a drag
      if (!isDragging) {
        onClick?.(task);
      }
    };

    return (
        <div 
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={handleClick}
            className={`bg-white rounded-lg border p-3 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow ${
                isDragging ? 'opacity-50 shadow-lg ring-2 ring-indigo-400' : ''
                }`}
        >
            <div className='flex items-center justify-between mb-2'>
                <span className='text-sm'>
                    {typeIcons[task.type] || '✅'} <span className="text-xs text-gray-500 font-medium">{task.type}</span>
                </span>
            </div>
            <h4 className='text-sm font-medium text-gray-900 mb-2 line-clamp-2'>
                {task.title}
            </h4>
            <div className='flex items-center justify-between mt-auto'>
                <TaskPriorityBadge priority={task.priority} />
                <div className='flex items-center gap-2'>
                    {task.dueDate && (
                        <span className={`text-xs ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                        {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    )}

                    {task.assignedTo ? (
                        <Avatar
                            src={task.assignedTo.profileImageUrl ?? ''}
                            alt={`${task.assignedTo.firstName} ${task.assignedTo.lastName}`}
                        />
                        ) : (
                        <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-400">?</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TaskCard;