import { useNavigate } from "react-router-dom";
import type { ProjectStats } from "../types/dashboard.types";

interface ProjectHealthCardsProps {
  projects: ProjectStats[];
}

const STATUS_BADGE_COLORS: Record<string, string> = {
  PLANNING: "bg-blue-100 text-blue-700",
  ACTIVE: "bg-green-100 text-green-700",
  ON_HOLD: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-gray-100 text-gray-700",
  CANCELLED: "bg-red-100 text-red-700",
  ABANDONED: "bg-gray-100 text-gray-500",
};

const ProjectHealthCards = ({ projects }: ProjectHealthCardsProps) => {
  const navigate = useNavigate();

  if (projects.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        No projects yet. Create one to get started!
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Project Health
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project.projectId}
            className="bg-white rounded-lg shadow p-5 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(`/projects/${project.projectId}`)}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900 truncate mr-2">
                {project.projectName}
              </h4>
              <span
                className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${STATUS_BADGE_COLORS[project.projectStatus] || "bg-gray-100 text-gray-700"}`}
              >
                {project.projectStatus}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{
                  width: `${Math.min(project.completionPercentage, 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mb-3">
              {project.completedTasks}/{project.totalTasks} tasks (
              {project.completionPercentage}%)
            </p>

            <div className="flex justify-between text-xs text-gray-500">
              <span>{project.memberCount} members</span>
              {project.overdueTaskCount > 0 && (
                <span className="text-red-600 font-medium">
                  {project.overdueTaskCount} overdue
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectHealthCards;
