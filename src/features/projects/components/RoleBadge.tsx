import React from 'react'
import { ProjectRole } from '../types/project.types';

interface RoleBadgeProps {
    role: ProjectRole;
    isOwner?: boolean;
}

const RoleBadge = ({role, isOwner= false}:RoleBadgeProps) => {

    if(isOwner){
        return (
            <div>
                <span className='px-2 py-1 rounded-md text-white text-sm font-semibold bg-purple-500'>
                    OWNER
                </span>
            </div>
        )
    }
  return (
    <div>
        <span className = {`px-2 py-1 rounded-md text-white text-sm font-semibold ${role === ProjectRole.ADMIN ? 'bg-blue-500' : 'bg-gray-500'}`}>
            {role}
        </span>
    </div>
  )
}

export default RoleBadge
