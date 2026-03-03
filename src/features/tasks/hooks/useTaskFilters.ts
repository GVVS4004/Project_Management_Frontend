import { useState, useMemo } from 'react';
import type { Task } from '../types/task.types';
import { TaskStatus, TaskPriority, TaskType } from '../types/task.types';

type SortField = 'title' | 'status' | 'priority' | 'type' | 'dueDate' | 'createdAt' | 'assignedTo';
type SortDirection = 'asc' | 'desc';

const PRIORITY_ORDER: Record<TaskPriority, number> = {
[TaskPriority.CRITICAL]: 0,
[TaskPriority.HIGH]: 1,
[TaskPriority.MEDIUM]: 2,
[TaskPriority.LOW]: 3,
};

export const useTaskFilters = (tasks: Task[]) => {
    const [statusFilter, setStatusFilter] = useState<TaskStatus[]>([]);
    const [priorityFilter, setPriorityFilter] = useState<TaskPriority[]>([]);
    const [typeFilter, setTypeFilter] = useState<TaskType[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [sortField, setSortField] = useState<SortField>('createdAt');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    const filteredTasks = useMemo(() => {
        let result = [...tasks];
        
        if(statusFilter.length > 0) {
            result = result.filter(task => statusFilter.includes(task.status));
        }

        if(priorityFilter.length > 0) {
            result = result.filter(task => priorityFilter.includes(task.priority));
        }

        if(typeFilter.length > 0) {
            result = result.filter(task => typeFilter.includes(task.type));
        }

        if(searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(task => 
                task.title.toLowerCase().includes(query) || 
                task.description.toLowerCase().includes(query)
            );
        }

        result.sort((a, b) => {
            let comparision = 0;

            switch(sortField) {
                case 'title':
                    comparision = a.title.localeCompare(b.title);
                    break;
                case 'status':
                    comparision = a.status.localeCompare(b.status);
                    break;
                case 'priority':
                    comparision = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
                    break;
                case 'type':
                    comparision = a.type.localeCompare(b.type);
                    break;
                case 'dueDate':{
                    const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
                    const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
                    comparision = aDate - bDate;
                    break;
                }
                case 'createdAt':{
                    const aDate = new Date(a.createdAt).getTime();
                    const bDate = new Date(b.createdAt).getTime();
                    comparision = aDate - bDate;
                    break;
                }
                case 'assignedTo':{
                    const aName = a.assignedTo?.firstName ?? '\uffff';
                    const bName = b.assignedTo?.firstName ?? '\uffff';
                    comparision = aName.localeCompare(bName);
                    break;
                }
            }
            return sortDirection === 'asc' ? comparision : -comparision;
        });

        return result;
    }, [tasks, statusFilter, priorityFilter, typeFilter, searchQuery, sortField, sortDirection]);

    const toggleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const clearFilters = () => {
        setStatusFilter([]);
        setPriorityFilter([]);
        setTypeFilter([]);
        setSearchQuery('');
    };

    const activeFilterCount = (statusFilter.length > 0 ? 1 : 0) +
        (priorityFilter.length > 0 ? 1 : 0) +
        (typeFilter.length > 0 ? 1 : 0) +
        (searchQuery.trim() ? 1 : 0);

    return {
        filteredTasks,
        statusFilter,
        setStatusFilter,
        priorityFilter,
        setPriorityFilter,
        typeFilter,
        setTypeFilter,
        searchQuery,
        setSearchQuery,
        sortField,
        setSortField,
        sortDirection,
        setSortDirection,
        toggleSort,
        clearFilters,
        activeFilterCount,
    };
};
