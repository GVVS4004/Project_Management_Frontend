import type { Project } from "../types/project.types";
import ProjectStatusItem from "./ProjectStatusItem";
import Avatar from "../../../components/Avatar";
import Tooltip from "../../../components/ToolTip";
import { formatDate } from "../../../utils/dateUtils";
import { Link } from "react-router-dom";

interface ProjectListItemProps {
  project: Project;
  onEdit?: (project: Project) => void;  // Optional callback for edit action
}

const ProjectListItem = ({ project, onEdit }: ProjectListItemProps) => {
  return (
    <Link to={`/projects/${project.id}`}>
      <div className="bg-white p-4 rounded-sm shadow hover:shadow-md transition-shadow cursor-pointer w-full">
        <div className="grid grid-cols-5 gap-2">
          <div className="col-span-5">
            <div className="grid grid-cols-[minmax(200px,1fr)_auto_auto_auto_auto_auto] items-center gap-4 mb-2">
              <Tooltip content={project.name}>
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                  {project.name}
                </h2>
              </Tooltip>
              <div>
                <ProjectStatusItem status={project.status}></ProjectStatusItem>
              </div>
              <div className="flex gap-3">
                <p className="text-gray-500 text-sm">
                  Start :{" "}
                  {project.startDate
                    ? formatDate(project.startDate)
                    : "Not set"}
                </p>
                <p className="text-gray-500 text-sm">
                  End :{" "}
                  {project.endDate ? formatDate(project.endDate) : "Not set"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip
                  content={
                    project.owner.firstName + " " + project.owner.lastName
                  }
                >
                  <div className="flex items-center">
                    <Avatar
                      src={project.owner.profileImageUrl ?? ""}
                      alt={`${project.owner.firstName} ${project.owner.lastName}`}
                    ></Avatar>
                    <span className="ml-2 text-gray-700 line-clamp-1">
                      {project.owner.firstName} {project.owner.lastName}
                    </span>
                  </div>
                </Tooltip>
              </div>
              <div className="flex gap-3">
                <p className="text-gray-500 text-sm">
                  Created at :{" "}
                  {project.createdAt
                    ? formatDate(project.createdAt)
                    : "Not set"}
                </p>
                <p className="text-gray-500 text-sm">
                  Updated at :{" "}
                  {project.updatedAt
                    ? formatDate(project.updatedAt)
                    : "Not set"}
                </p>
              </div>

              {/* Edit Button */}
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.preventDefault();  // Prevent Link navigation
                    e.stopPropagation();  // Stop event bubbling
                    onEdit(project);
                  }}
                  className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                  title="Edit project"
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <div className="col-span-5">
            <span className="text-gray-600 line-clamp-2">
              {project.description}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectListItem;
