import { TaskStatus, TaskPriority, TaskType } from '../types/task.types';

interface TaskFiltersProps {
statusFilter: TaskStatus[];
setStatusFilter: (statuses: TaskStatus[]) => void;
priorityFilter: TaskPriority[];
setPriorityFilter: (priorities: TaskPriority[]) => void;
typeFilter: TaskType[];
setTypeFilter: (types: TaskType[]) => void;
searchQuery: string;
setSearchQuery: (query: string) => void;
clearFilters: () => void;
activeFilterCount: number;
}

const toggleArrayValue = <T,>(array: T[], value: T): T[] => {
return array.includes(value)
    ? array.filter(item => item !== value)
    : [...array, value];
};

const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div>
        <h4 className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2'>{title}</h4>
        <div className='space-y-1'>{children}</div>
    </div>
);

const CheckboxItem = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) => (
    <label className='flex items-center gap-2 cursor-pointer py-0.5'>
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="h-3.5 w-3.5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <span className='text-sm text-gray-700'>{label}</span>
    </label>
);


const TaskFilters = ({
    statusFilter, setStatusFilter,
    priorityFilter, setPriorityFilter,
    typeFilter, setTypeFilter,
    searchQuery, setSearchQuery,
    clearFilters,
    activeFilterCount,
}: TaskFiltersProps) => {
    return (
        <div className='w-64 shrink-0 bg-white rounded-lg border border-gray-200 p-4 space-y-5'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <h3 className='text-sm font-semibold text-gray-900'>
                        Filters
                    </h3>
                    {activeFilterCount > 0 && (
                        <span className='bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full'>
                            {activeFilterCount}
                        </span>
                    )}
                </div>
                {activeFilterCount > 0 && (
                    <button
                        onClick={clearFilters}
                        className='text-sm text-indigo-600 hover:text-indigo-800'
                    >
                        Clear all
                    </button>
                )}
            </div>
            <div>
                <input
                    type="text"
                    placeholder='Search tasks...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1
                            focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
            <FilterSection title="Status">
                {Object.values(TaskStatus).map(status => (
                    <CheckboxItem
                        key={status}
                        label={status.replace('_', ' ')}
                        checked={statusFilter.includes(status)}
                        onChange={() => setStatusFilter(toggleArrayValue(statusFilter, status))}
                    />
                ))}
            </FilterSection>

            <FilterSection title="Priority">
                {Object.values(TaskPriority).map(priority => (
                    <CheckboxItem
                        key={priority}
                        label={priority.replace('_', ' ')}
                        checked={priorityFilter.includes(priority)}
                        onChange={() => setPriorityFilter(toggleArrayValue(priorityFilter, priority))}
                    />
                ))}
            </FilterSection>

            <FilterSection title="Type">
                {Object.values(TaskType).map(type => (
                    <CheckboxItem
                        key={type}
                        label={type.replace('_', ' ')}
                        checked={typeFilter.includes(type)}
                        onChange={() => setTypeFilter(toggleArrayValue(typeFilter, type))}
                    />
                ))}
            </FilterSection>
        </div>
    )
};

export default TaskFilters;