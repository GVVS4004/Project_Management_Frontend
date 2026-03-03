import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskStatus, type Task } from '../types/task.types';
import TaskCard from './TaskCard';

const columnConfig: Record<TaskStatus, { label: string; headerBg: string; dropBg: string }> = {
[TaskStatus.TODO]: { label: 'To Do', headerBg: 'bg-gray-200', dropBg: 'bg-gray-50' },
[TaskStatus.IN_PROGRESS]: { label: 'In Progress', headerBg: 'bg-blue-200', dropBg: 'bg-blue-50' },
[TaskStatus.BLOCKED]: { label: 'Blocked', headerBg: 'bg-red-200', dropBg: 'bg-red-50' },
[TaskStatus.REVIEW]: { label: 'Review', headerBg: 'bg-purple-200', dropBg: 'bg-purple-50' },
[TaskStatus.TESTING]: { label: 'Testing', headerBg: 'bg-yellow-200', dropBg: 'bg-yellow-50' },
[TaskStatus.DONE]: { label: 'Done', headerBg: 'bg-green-200', dropBg: 'bg-green-50' },
[TaskStatus.ABANDONED]: { label: 'Abandoned', headerBg: 'bg-gray-300', dropBg: 'bg-gray-100' },
};

interface BoardColumnProps {
status: TaskStatus;
tasks: Task[];
onTaskClick?: (task: Task) => void;
}


const BoardColumn = ({ status, tasks, onTaskClick }: BoardColumnProps) => {
    const { setNodeRef, isOver } = useDroppable({ id: status });
    const config = columnConfig[status];

    return (
        <div className='flex flex-col w-72 min-w-[288px] shrink-0'>
            <div className={`rounded-t-lg px-3 py-2 ${config.headerBg}`}>
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-800">{config.label}</h3>
                    <span className="text-xs font-medium text-gray-600 bg-white/60 rounded-full px-2 py-0.5">
                    {tasks.length}
                    </span>
                </div>
            </div>
             <div
                ref={setNodeRef}
                className={`flex-1 rounded-b-lg border-2 border-dashed p-2 space-y-2 min-h-[200px] transition-colors ${
                    isOver ? `${config.dropBg} border-indigo-400` : 'border-transparent bg-gray-50/50'
                }`}
                >
                <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} onClick={onTaskClick} />
                    ))}
                </SortableContext>

                {tasks.length === 0 && (
                    <div className="flex items-center justify-center h-24 text-sm text-gray-400">
                    No tasks
                    </div>
                )}
            </div>
        </div>
    );
}

export default BoardColumn;