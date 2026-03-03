import type { Task } from "../types/task.types";
import TaskTableRow from "./TaskTableRow";

type SortField =
  | "title"
  | "status"
  | "priority"
  | "type"
  | "dueDate"
  | "createdAt"
  | "assignedTo";

interface TaskTableProps {
  tasks: Task[];
  selectedTaskIds: Set<number>;
  onSelectToggle: (taskId: number) => void;
  onSelectAll: () => void;
  onTaskClick?: (task: Task) => void;
  sortField: SortField;
  sortDirection: "asc" | "desc";
  onToggleSort: (field: SortField) => void;
}

const COLUMNS: { label: string; field: SortField }[] = [
  { label: "Title", field: "title" },
  { label: "Status", field: "status" },
  { label: "Priority", field: "priority" },
  { label: "Type", field: "type" },
  { label: "Assigned To", field: "assignedTo" },
  { label: "Due Date", field: "dueDate" },
];


const TaskTable = ({
    tasks,
    selectedTaskIds,
    onSelectToggle,
    onSelectAll,
    onTaskClick,
    sortField,
    sortDirection,
    onToggleSort,
}: TaskTableProps) => {
    const allSelected = tasks.length > 0 && tasks.every(task => selectedTaskIds.has(task.id));

    const SortIcon = ({ field }: { field: SortField }) => {

        if (sortField !== field){
            return <span className="text-gray-400 ml-1">⇅</span>;
        }
        return <span className="text-indigo-600 ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>;
    }

    if(tasks.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <p className="text-gray-500">No tasks match your filters.</p>
            </div>
        );
    }
    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                    <tr>
                        <th className="px-4 py-3 w-10">
                            <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={onSelectAll}
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">
                            ID
                        </th>

                        {/* Sortable columns */}
                        {COLUMNS.map(col => (
                            <th
                            key={col.field}
                            onClick={() => onToggleSort(col.field)}
                            className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider
            cursor-pointer hover:text-gray-700 select-none"
                            >
                            {col.label}
                            <SortIcon field={col.field} />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {tasks.map(task => (
                        <TaskTableRow
                            key={task.id}
                            task={task}
                            isSelected={selectedTaskIds.has(task.id)}
                            onSelectToggle={onSelectToggle}
                            onTaskClick={onTaskClick}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TaskTable;