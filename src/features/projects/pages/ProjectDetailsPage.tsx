import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProjectById, useDeleteProject, useMembers } from '../hooks/useProjects';
import { ProjectFormModal } from '../components/ProjectFormModal';
import ProjectStatusItem from '../components/ProjectStatusItem';
import Avatar from '../../../components/Avatar';
import { formatDate } from '../../../utils/dateUtils';
import { userService } from '../../../services/auth.service';
import MemberList from '../components/MemberList';
import AddMemberModal from '../components/AddMemberModal';

/**
 * ProjectDetailsPage - Full project information view
 *
 * Features:
 * - Display all project details
 * - Edit project (opens modal)
 * - Delete project (with confirmation)
 * - Back navigation
 * - Loading and error states
 */

const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();  // Get project ID from URL
  const navigate = useNavigate();
  const { data: project, isLoading, error } = useProjectById(Number(projectId));

  // Only fetch members if project exists and loaded successfully
  const { data: members } = useMembers(Number(projectId), {
    enabled: !!project, // Only fetch when project is loaded
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const currentUser = userService.getUser();
  const currentUserId = currentUser?.id ?? 0;

  const isOwner = project?.owner.id === currentUserId;
  const isAdmin = currentUser?.role === 'ADMIN' || currentUser?.role === 'MANAGER';
  const isOwnerOrAdmin = isOwner || isAdmin;
  // Fetch project data using the ID from URL

  // Delete mutation
  const deleteMutation = useDeleteProject();

  // Handle delete project
  const handleDelete = async () => {
    if (!project) return;

    try {
      await deleteMutation.mutateAsync(project.id);
      navigate('/projects'); // Redirect after delete
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const handleAddMember = () => {
    setIsAddMemberModalOpen(true);
  }

  // LOADING STATE
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-600">Loading project details...</p>
      </div>
    );
  }

  // ERROR STATE
  if (error || !project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Failed to load project
          </h3>
          <p className="text-red-700 mb-4">
            {error?.message || 'Project not found'}
          </p>
          <Link
            to="/projects"
            className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  // MAIN RENDER
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/projects')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Projects
      </button>

      {/* Main Card */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Header with Title and Actions */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {project.name}
            </h1>
            <ProjectStatusItem status={project.status} />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {/* Edit Button */}
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
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

            {/* Delete Button */}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete project"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Description
          </h2>
          <p className="text-gray-700 whitespace-pre-wrap">
            {project.description || 'No description provided'}
          </p>
        </div>

        {/* Project Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Start Date */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Start Date
            </h3>
            <p className="text-gray-900">
              {project.startDate ? formatDate(project.startDate) : 'Not set'}
            </p>
          </div>

          {/* End Date */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">End Date</h3>
            <p className="text-gray-900">
              {project.endDate ? formatDate(project.endDate) : 'Not set'}
            </p>
          </div>

          {/* Created At */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Created
            </h3>
            <p className="text-gray-900">{formatDate(project.createdAt)}</p>
          </div>

          {/* Updated At */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Last Updated
            </h3>
            <p className="text-gray-900">{formatDate(project.updatedAt)}</p>
          </div>
        </div>

        {/* Board Navigation */}
        <div className="border-t pt-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Boards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to={`/projects/${projectId}/epics`}
              className="flex items-center gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Epic Board</p>
                <p className="text-sm text-gray-500">View and manage epics</p>
              </div>
            </Link>
            <Link
              to={`/projects/${projectId}/tasks`}
              className="flex items-center gap-3 p-4 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <div className="p-2 bg-indigo-100 rounded-lg">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Task Board</p>
                <p className="text-sm text-gray-500">View and manage stories, tasks, and bugs</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Owner Information */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Project Owner
          </h2>
          <div className="flex items-center gap-4">
            <Avatar
              src={project.owner.profileImageUrl ?? ''}
              alt={`${project.owner.firstName} ${project.owner.lastName}`}
            />
            <div>
              <p className="font-medium text-gray-900">
                {project.owner.firstName} {project.owner.lastName}
              </p>
              <p className="text-sm text-gray-600">{project.owner.email}</p>
              <p className="text-sm text-gray-500">@{project.owner.userName}</p>
            </div>
          </div>
        </div>

        <div className='border-t pt-6 mt-6'> 
          <MemberList
            project={project}
            currentUserId={currentUserId}
            isOwnerOrAdmin={isOwnerOrAdmin}
            onAddMember={handleAddMember}
          />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Project?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{project.name}"? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={deleteMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <ProjectFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        mode="edit"
        project={project}
      />

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        projectId={project.id}
        existingMemberIds={members?.map(m => m.user.id) || []}
      />
    </div>
  );
};

export default ProjectDetailsPage;
