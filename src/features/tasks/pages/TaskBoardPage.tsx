import { useState, useCallback } from "react";
import { useMyProjects } from "../../projects/hooks/useProjects";
import { useTasksByProject, useUpdateTaskStatus, useDeleteTask } from "../hooks/useTasks";
  import { TaskStatus, type Task } from "../types/task.types";
  import { useTaskFilters } from "../hooks/useTaskFilters";
  import KanbanBoard from "../components/KanbanBoard";
  import TaskFormModal from "../components/TaskFormModal";
  import ViewToggle from "../components/ViewToggle";
  import TaskFilters from "../components/TaskFilters";
  import TaskTable from "../components/TaskTable";
  import BulkActionBar from "../components/BulkActionBar";
import { useNavigate } from "react-router-dom";

  const TaskBoardPage = () => {
    const [selectedProjectId, setSelectedProjectId] = useState<number>(0);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [activeView, setActiveView] = useState<'board' | 'list'>('board');
    const [selectedTaskIds, setSelectedTaskIds] = useState<Set<number>>(new Set());

    const navigate = useNavigate();

    const { data: projectsData, isLoading: projectsLoading } = useMyProjects();
    const {
      data: tasksData,
      isLoading: tasksLoading,
      isError,
    } = useTasksByProject(selectedProjectId, { page: 0, size: 100 });

    const updateTaskStatusMutation = useUpdateTaskStatus();
    const deleteTaskMutation = useDeleteTask();

    const projects = projectsData?.content ?? [];
    const tasks = tasksData?.content ?? [];

    const handleTaskClick = (task: Task) => {
      navigate(`/tasks/${task.id}`);
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

    if (selectedProjectId === 0 && projects.length > 0) {
      setSelectedProjectId(projects[0].id);
    }

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

    const handleProjectChange = (projectId: number) => {
      setSelectedProjectId(projectId);
      setSelectedTaskIds(new Set());
      clearFilters();
    };

    const renderContent = () => {
      if (projectsLoading) {
        return (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          </div>
        );
      }

      if (projects.length === 0) {
        return (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No projects found</p>
            <p className="text-gray-400 text-sm mt-1">Create a project first to start adding tasks</p>
          </div>
        );
      }

      if (selectedProjectId === 0) {
        return (
          <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow">
            <p className="text-gray-500">Select a project to view tasks</p>
          </div>
        );
      }

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
            <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
            <p className="text-sm text-gray-500 mt-1">
              {activeView === 'board'
                ? 'Drag and drop tasks to update their status'
                : 'View, filter, and manage tasks in bulk'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <ViewToggle activeView={activeView} onViewChange={handleViewChange} />

            {/* Project Selector */}
            <select
              value={selectedProjectId}
              onChange={(e) => handleProjectChange(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500
  focus:border-transparent text-sm"
            >
              <option value={0} disabled>
                Select a project
              </option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>

            {/* Create Task Button */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              disabled={selectedProjectId === 0}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700
  disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              + New Task
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

  export default TaskBoardPage;