import { Link } from "react-router-dom";
import Avatar from "../../../components/Avatar";
import type { Project } from "../types/project.types";
import ProjectStatusItem from "./ProjectStatusItem";
import Tooltip from "../../../components/ToolTip";
import { formatDate } from "../../../utils/dateUtils";

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;  // Optional callback for edit action
}

const ProjectCard = ({ project, onEdit }: ProjectCardProps) => {
  return (
    <Link to={`/projects/${project.id}`}>
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 cursor-pointer w-full">
        <div className="flex flex-col p-4">
          <div className="flex flex-row gap-2 justify-between">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-gray-800 truncate w-50">
                <Tooltip content={project.name}>{project.name}</Tooltip>
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <ProjectStatusItem status={project.status} />
            </div>
            <div className="flex items-center gap-2">
              {/* Edit Button - Only show if onEdit callback is provided */}
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
          <div>
            <p className="text-gray-600 line-clamp-2">{project.description}</p>
          </div>
          <div className="my-2">
            <p className="text-gray-500 text-sm m-1">
              Start: {formatDate(project.startDate)}
            </p>
            <p className="text-gray-500 text-sm m-1">
              End: {formatDate(project.endDate)}
            </p>
          </div>
          <hr className="border-gray-300" id="divider"></hr>
          <div className="flex items-center mt-4">
            <Tooltip
              content={project.owner.firstName + " " + project.owner.lastName}
            >
              <div className="flex items-center">
                <Avatar
                  src={project.owner.profileImageUrl ?? ""}
                  alt={`${project.owner.firstName} ${project.owner.lastName}`}
                ></Avatar>
                <span className="ml-2 text-gray-700 truncate w-48">
                  {project.owner.firstName} {project.owner.lastName}
                </span>
              </div>
            </Tooltip>
          </div>
          <div>
            <p className="text-gray-400 text-xs m-1">
              Created At: {formatDate(project.createdAt)}
            </p>
            <p className="text-gray-400 text-xs m-1">
              Updated At: {formatDate(project.updatedAt)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
