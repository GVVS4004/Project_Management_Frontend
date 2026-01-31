import React, { useEffect, useMemo, useRef, useCallback } from "react";
import type { Project, ProjectStatus } from "../types/project.types";
import { useInfiniteProjects } from "../hooks/useProjects";
import ProjectCard from "../components/ProjectCard";
import ProjectListItem from "../components/ProjectListItem";
import { ProjectFormModal } from "../components/ProjectFormModal";

const ProjectsPage = () => {
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = React.useState<ProjectStatus | "ALL">(
    "ALL"
  );
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = React.useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState<
    Project | undefined
  >(undefined);
  console.log(selectedProject);

  // Debounce search query (500ms delay for more comfortable typing)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Memoize search handler to prevent re-creation on every render
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteProjects({
    size: 10,
    ...(statusFilter !== "ALL" && { status: statusFilter as ProjectStatus }),
    ...(debouncedSearchQuery.length > 0 && { search: debouncedSearchQuery }),
  });

  const allProjects = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.content);
  }, [data]);
  const observerTarget = useRef<HTMLDivElement | null>(null);

  // Handler for opening edit modal with selected project
  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  // Handler for closing edit modal
  const handleCloseEdit = () => {
    setIsEditModalOpen(false);
    setSelectedProject(undefined);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0].isIntersecting;
        if (isVisible && hasNextPage && !isFetchingNextPage) {
          console.log("Fetching next page...");
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );
    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* 🔥 LOADING STATE: Show spinner on initial load */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      )}

      {/* 🔥 ERROR STATE: Show error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Failed to load projects
          </h3>
          <p className="text-red-700 mb-4">{error.message}</p>
        </div>
      )}

      {/* 🔥 MAIN CONTENT: Show when not loading and no error */}
      {!isLoading && !error && (
        <>
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
              <p className="text-gray-600 mt-1">
                {allProjects.length} projects loaded
              </p>
            </div>

            {/* Create Project Button */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Project
            </button>
          </div>

          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search Input */}
              <div className="flex-1 w-full md:max-w-md">
                <input
                  type="text"
                  placeholder="🔍 Search projects..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as ProjectStatus | "ALL")
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="ALL">All Status</option>
                  <option value="PLANNING">Planning</option>
                  <option value="ACTIVE">Active</option>
                  <option value="ON_HOLD">On Hold</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ABANDONED">Abandoned</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="inline-flex rounded-md shadow-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-2 rounded-l-lg ${
                    viewMode === "grid"
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-700 border"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-2 rounded-r-lg ${
                    viewMode === "list"
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-700 border"
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* 🔥 EMPTY STATE */}
          {allProjects.length === 0 && (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">📂</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No projects found
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first project to get started!
              </p>
            </div>
          )}

          {/* 🔥 PROJECTS DISPLAY: Grid or List */}
          {allProjects.length > 0 && (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onEdit={handleEdit}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {allProjects.map((project) => (
                    <ProjectListItem
                      key={project.id}
                      project={project}
                      onEdit={handleEdit}
                    />
                  ))}
                </div>
              )}

              {/* 🔥 SENTINEL ELEMENT: The invisible trigger */}
              {/* This div is what the Intersection Observer watches */}
              <div
                ref={observerTarget} // Attach the observer ref
                className="h-20 flex items-center justify-center mt-6"
              >
                {isFetchingNextPage && (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                    <p className="text-gray-600">Loading more projects...</p>
                  </div>
                )}
              </div>

              {/* 🔥 END OF LIST: Show when no more pages */}
              {!hasNextPage && (
                <div className="text-center py-4 text-gray-500">
                  <p>✅ You've reached the end of the list</p>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Create Project Modal */}
      {isCreateModalOpen && (
        <ProjectFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          mode="create"
        />
      )}

      {/* Edit Project Modal */}
      {selectedProject && isEditModalOpen && (
        <ProjectFormModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEdit}
          mode="edit"
          project={selectedProject}
        />
      )}
    </div>
  );
};

export default ProjectsPage;
