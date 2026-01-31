import React from "react";
import type { Project, ProjectRole } from "../types/project.types";
import { useMembers, useRemoveMember, useUpdateMemberRole } from "../hooks/useProjects";
import MemberRow from "./MemberRow";

interface MemberListProps {
  project: Project;
  currentUserId: number;
  isOwnerOrAdmin: boolean;
  onAddMember?: () => void;
}
const MemberList = ({
  project,
  currentUserId,
  isOwnerOrAdmin,
  onAddMember,
}: MemberListProps) => {

    const {data:members, isLoading, error} = useMembers(project.id);
    const removeMemberMutation = useRemoveMember();
    const updateRoleMutation = useUpdateMemberRole();

    const handleRemoveMember = (userId: number) => {
        const member = members?.find(m => m.user.id === userId);
        if (!member) return;
        const memberName = member.user.firstName && member.user.lastName
            ? `${member.user.firstName} ${member.user.lastName}`
            : member.user.userName;
        if(window.confirm(`Are you sure you want to remove ${memberName} from the project?`)) {
            removeMemberMutation.mutate({projectId: project.id, userId});
        }
    };

    const handleChangeRole = (userId: number, newRole: ProjectRole) => {
        updateRoleMutation.mutate({projectId: project.id, userId, data: {role: newRole}});
    }

    if(isLoading){
        return <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading team members...</span>
            </div> 
        </div>
    }

    if(error){
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-1.414 1.414M6.343 17.657l-1.414 1.414M21 12h-3M6 12H3m15.364 6.364l-1.414-1.414M6.343 6.343L4.929 4.929M16.95 7.05l-1.414-1.414M7.05 16.95l-1.414-1.414M12 21v-3M12 6V3" />
                        </svg>
                    <p className="mt-4 text-gray-600">Failed to load team members.</p>
                    <p className="mt-2 text-sm text-gray-500">
                        {error instanceof Error ? error.message : 'An error occurred.'}
                    </p>
                </div>
            </div>
        )
    }
    if (!members || members.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Team Members</h3>
            {isOwnerOrAdmin && onAddMember && (
              <button
                onClick={onAddMember}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
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
                Add Member
              </button>
            )}
          </div>

          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No team members yet</h3>
            <p className="mt-2 text-sm text-gray-500">
              {isOwnerOrAdmin
                ? "Get started by adding members to collaborate on this project"
                : "No members have been added to this project yet"}
            </p>
          </div>
        </div>
      );
    }
  return (
      <div className="bg-white rounded-lg shadow p-6">
        {/* Header with count and Add button */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Team Members ({members.length})
          </h3>
          {isOwnerOrAdmin && onAddMember && (
            <button
              onClick={onAddMember}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
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
              Add Member
            </button>
          )}
        </div>

        {/* Members list */}
        <div className="divide-y divide-gray-200">
          {members.map((member) => (
            <MemberRow
              key={member.user.id}
              member={member}
              projectOwnerId={project.owner.id}
              isOwnerOrAdmin={isOwnerOrAdmin}
              onRemove={handleRemoveMember}
              onChangeRole={handleChangeRole}
            />
          ))}
        </div>

        {/* Mutation loading/error feedback */}
        {(removeMemberMutation.isPending || updateRoleMutation.isPending) && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">Processing...</p>
          </div>
        )}

        {removeMemberMutation.isError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              Failed to remove member. Please try again.
            </p>
          </div>
        )}

        {updateRoleMutation.isError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              Failed to update role. Please try again.
            </p>
          </div>
        )}
      </div>
    );
};

export default MemberList;
