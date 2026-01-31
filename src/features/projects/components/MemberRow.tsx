import React from "react";
import type { ProjectMember, ProjectRole } from "../types/project.types";
import Avatar from "../../../components/Avatar";
import RoleBadge from "./RoleBadge";

interface MemberRowProps {
  member: ProjectMember;
  projectOwnerId: number;
  isOwnerOrAdmin: boolean;
  onRemove: (userId: number) => void;
  onChangeRole?: (userId: number, newRole: ProjectRole) => void;
}
const MemberRow = ({
  member,
  projectOwnerId,
  isOwnerOrAdmin,
  onRemove,
  onChangeRole,
}: MemberRowProps) => {
  const isOwner = member.user.id === projectOwnerId;
  const showActions = isOwnerOrAdmin && !isOwner;
  const displayName =
    member.user.firstName && member.user.lastName
      ? `${member.user.firstName} ${member.user.lastName}`
      : member.user.userName;

  return (
    <div className="flex items-center justify-between py-4 hover:bg-gray-50 px-4 rounded-lg transition-colors">
      <div className="flex items-center space-x-4 flex-1">
        <Avatar src={member.user.profileImageUrl || ""} alt={displayName} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-900 truncate">{displayName}</p>
            {isOwner && (
              <span className="text-xs text-purple-600 font-medium">
                (Project Owner)
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 truncate">{member.user.email}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <RoleBadge role={member.role} isOwner={isOwner} />
        {showActions && (
          <div className="flex items-center space-x-3">
            <select
              value={member.role}
              onChange={(e) =>
                onChangeRole?.(member.user.id, e.target.value as ProjectRole)
              }
              className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={"MEMBER"}>Member</option>
              <option value={"ADMIN"}>Admin</option>
            </select>
            <button
              onClick={() => onRemove(member.user.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Remove member"
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
        )}
      </div>
    </div>
  );
};

export default MemberRow;
