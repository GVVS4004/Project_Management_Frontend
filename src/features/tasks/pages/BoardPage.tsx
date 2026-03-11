import { useState, useCallback } from "react";
import { useTasksByProject, useUpdateTaskStatus, useDeleteTask } from "../hooks/useTasks";
import { useProjectById } from "../../projects/hooks/useProjects";
import { TaskStatus, type Task } from "../types/task.types";
import { useTaskFilters } from "../hooks/useTaskFilters";
import KanbanBoard from "../components/KanbanBoard";
import TaskFormModal from "../components/TaskFormModal";
import ViewToggle from "../components/ViewToggle";
import TaskFilters from "../components/TaskFilters";
import TaskTable from "../components/TaskTable";
import BulkActionBar from "../components/BulkActionBar";
import { useNavigate, useParams, Link } from "react-router-dom";

interface BoardPageProps {
    title: string;
    taskTypes: string[];
    createButtonLabel: string;
}

  const BoardPage = ({ title, taskTypes, createButtonLabel }: BoardPageProps) => {
    const { projectId } = useParams<{ projectId: string }>();
    const selectedProjectId = Number(projectId) || 0;
    const { data: project } = useProjectById(selectedProjectId);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [activeView, setActiveView] = useState<'board' | 'list'>('board');
    const [selectedTaskIds, setSelectedTaskIds] = useState<Set<number>>(new Set());

    const navigate = useNavigate();

    const {
      data: tasksData,
      isLoading: tasksLoading,
      isError,
    } = useTasksByProject(selectedProjectId, { page: 0, size: 100, taskTypes });

    const updateTaskStatusMutation = useUpdateTaskStatus();
    const deleteTaskMutation = useDeleteTask();

    const tasks = tasksData?.content ?? [];

    const handleTaskClick = (task: Task) => {
      navigate(`/projects/${projectId}/tasks/${task.id}`);
    };

    const {
      filteredTasks,
      statusFilter, setStatusFilter,
      priorityFilter, setPriorityFilter,
      typeFilter, setTypeFilter,
      searchQuery, setSearchQuery,
      sortField, sortDirection, toggleSort,
      clearFilters,
      activeFilterCount,
    } = useTaskFilters(tasks);

    const handleSelectToggle = useCallback((taskId: number) => {
      setSelectedTaskIds(prev => {
        const next = new Set(prev);
        if (next.has(taskId)) {
          next.delete(taskId);
        } else {
          next.add(taskId);
        }
        return next;
      });
    }, []);

    const handleSelectAll = useCallback(() => {
      setSelectedTaskIds(prev => {
        const allSelected = filteredTasks.every(t => prev.has(t.id));
        if (allSelected) {
          return new Set();
        }
        return new Set(filteredTasks.map(t => t.id));
      });
    }, [filteredTasks]);

    const handleBulkStatusChange = useCallback((status: TaskStatus) => {
      selectedTaskIds.forEach(taskId => {
        updateTaskStatusMutation.mutate({ taskId, status, projectId: selectedProjectId });
      });
      setSelectedTaskIds(new Set());
    }, [selectedTaskIds, selectedProjectId, updateTaskStatusMutation]);

    const handleBulkDelete = useCallback(() => {
      selectedTaskIds.forEach(taskId => {
        deleteTaskMutation.mutate({ taskId, projectId: selectedProjectId });
      });
      setSelectedTaskIds(new Set());
    }, [selectedTaskIds, selectedProjectId, deleteTaskMutation]);

    // Clear selection when switching views or projects
    const handleViewChange = (view: 'board' | 'list') => {
      setActiveView(view);
      setSelectedTaskIds(new Set());
    };

    const renderContent = () => {

      if (tasksLoading) {
        return (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          </div>
        );
      }

      if (isError) {
        return (
          <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg">
            <p className="text-red-600">Failed to load tasks. Please try again.</p>
          </div>
        );
      }

      if (activeView === 'board') {
        return (
          <div className="overflow-x-auto max-w-full">
            <KanbanBoard tasks={tasks} projectId={selectedProjectId} onTaskClick={handleTaskClick}/>
          </div>
        );
      }

      // List view
      return (
        <div className="flex gap-4">
          <TaskFilters
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            clearFilters={clearFilters}
            activeFilterCount={activeFilterCount}
          />
          <div className="flex-1 overflow-x-auto">
            <TaskTable
              tasks={filteredTasks}
              selectedTaskIds={selectedTaskIds}
              onSelectToggle={handleSelectToggle}
              onSelectAll={handleSelectAll}
              sortField={sortField}
              sortDirection={sortDirection}
              onToggleSort={toggleSort}
              onTaskClick={handleTaskClick}
            />
          </div>
        </div>
      );
    };

    return (
      <div className="h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Link to={`/projects/${projectId}`} className="hover:text-indigo-600 transition-colors">
                {project?.name ?? 'Project'}
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">{title}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {activeView === 'board'
                ? 'Drag and drop tasks to update their status'
                : 'View, filter, and manage tasks in bulk'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <ViewToggle activeView={activeView} onViewChange={handleViewChange} />


            {/* Create Task Button */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              disabled={selectedProjectId === 0}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700
  disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {createButtonLabel}
            </button>
          </div>
        </div>

        {/* Content */}
        {renderContent()}

        {/* Bulk Action Bar (list view only) */}
        {activeView === 'list' && (
          <BulkActionBar
            selectedCount={selectedTaskIds.size}
            onClearSelection={() => setSelectedTaskIds(new Set())}
            onBulkStatusChange={handleBulkStatusChange}
            onBulkDelete={handleBulkDelete}
          />
        )}

        {/* Create Task Modal */}
        <TaskFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          projectId={selectedProjectId}
        />
      </div>
    );
  };

  export default BoardPage;