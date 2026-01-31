import React, { useEffect, useState } from "react";
import type { User } from "../../../types/auth.types";
import { useAddMember } from "../hooks/useProjects";
import { useSearchUsers } from "../../../hooks/useUser";
import { ProjectRole } from "../types/project.types";
import Avatar from "../../../components/Avatar";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  existingMemberIds: number[];
}

const AddMemberModal = ({
  isOpen,
  onClose,
  projectId,
  existingMemberIds,
}: AddMemberModalProps) => {

    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [selectedUser,setSelectedUser] = useState<User | null>(null);
    const [selectedRole,setSelectedRole] = useState<ProjectRole>(ProjectRole.MEMBER);

    const addMemberMutation = useAddMember();

    useEffect(()=>{
        const timer = setTimeout(()=>{
            setDebouncedQuery(searchQuery);
        },300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const {data:searchResults,isLoading:isSearching} = useSearchUsers(debouncedQuery);

    const availableUsers = searchResults?.filter(user => !existingMemberIds.includes(user.id)) || [];

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        if(!selectedUser) return;

        try {
            await addMemberMutation.mutateAsync({
                projectId,
                data: {
                    userId: selectedUser.id,
                    role: selectedRole,
                }
            });
            setSearchQuery("");
            setDebouncedQuery("");
            setSelectedUser(null);
            setSelectedRole(ProjectRole.MEMBER);
            onClose();
        }
        catch(error){
            console.error("Error adding member:",error);
        }
    };

    const handleUserSelect = (user: User) => {
        setSelectedUser(user);
        setSearchQuery("");
    }

    const handleCancel = () => {
        setSearchQuery("");
        setDebouncedQuery("");
        setSelectedUser(null);
        setSelectedRole(ProjectRole.MEMBER);
        onClose();
    }

    if(!isOpen) return null;


  return (
     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
       <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] flex flex-col">
         <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Team Member</h2>

         <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
           {/* Selected User Display */}
           {selectedUser ? (
             <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
               <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-3">
                   <Avatar
                     src={selectedUser.profileImageUrl || ''}
                     alt={selectedUser.username}
                   />
                   <div>
                     <p className="font-medium text-gray-900">
                       {selectedUser.firstName && selectedUser.lastName
                         ? `${selectedUser.firstName} ${selectedUser.lastName}`
                         : selectedUser.username}
                     </p>
                     <p className="text-sm text-gray-600">{selectedUser.email}</p>
                   </div>
                 </div>
                 <button
                   type="button"
                   onClick={() => setSelectedUser(null)}
                   className="text-gray-500 hover:text-gray-700"
                 >
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                   </svg>
                 </button>
               </div>

               {/* Role Selection */}
               <div className="mt-4">
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Role
                 </label>
                 <select
                   value={selectedRole}
                   onChange={(e) => setSelectedRole(e.target.value as ProjectRole)}
                   className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                 >
                   <option value={ProjectRole.MEMBER}>Member</option>
                   <option value={ProjectRole.ADMIN}>Admin</option>
                 </select>
               </div>
             </div>
           ) : (
             <>
               {/* Search Input */}
               <div className="mb-4">
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Search Users
                 </label>
                 <input
                   type="text"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="Search by name, username, or email..."
                   className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                   autoFocus
                 />
                 <p className="mt-1 text-xs text-gray-500">
                   Type at least 2 characters to search
                 </p>
               </div>

               {/* Search Results */}
               <div className="flex-1 overflow-y-auto min-h-0 mb-4">
                 {isSearching && debouncedQuery.length >= 2 && (
                   <div className="flex items-center justify-center py-8">
                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                     <span className="ml-3 text-gray-600">Searching...</span>
                   </div>
                 )}

                 {!isSearching && debouncedQuery.length >= 2 && availableUsers.length === 0 && (
                   <div className="text-center py-8">
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
                         d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2
 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                       />
                     </svg>
                     <p className="mt-4 text-gray-600">No users found</p>
                     <p className="mt-1 text-sm text-gray-500">
                       Try a different search term
                     </p>
                   </div>
                 )}

                 {!isSearching && availableUsers.length > 0 && (
                   <div className="space-y-2">
                     {availableUsers.map((user) => (
                       <button
                         key={user.id}
                         type="button"
                         onClick={() => handleUserSelect(user)}
                         className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                       >
                         <Avatar
                           src={user.profileImageUrl || ''}
                           alt={user.username}
                         />
                         <div className="flex-1 min-w-0">
                           <p className="font-medium text-gray-900 truncate">
                             {user.firstName && user.lastName
                               ? `${user.firstName} ${user.lastName}`
                               : user.username}
                           </p>
                           <p className="text-sm text-gray-600 truncate">{user.email}</p>
                         </div>
                         <svg
                           className="w-5 h-5 text-gray-400"
                           fill="none"
                           stroke="currentColor"
                           viewBox="0 0 24 24"
                         >
                           <path
                             strokeLinecap="round"
                             strokeLinejoin="round"
                             strokeWidth={2}
                             d="M9 5l7 7-7 7"
                           />
                         </svg>
                       </button>
                     ))}
                   </div>
                 )}

                 {debouncedQuery.length > 0 && debouncedQuery.length < 2 && (
                   <div className="text-center py-8 text-gray-500">
                     <p>Type at least 2 characters to search</p>
                   </div>
                 )}
               </div>
             </>
           )}

           {/* Action Buttons */}
           <div className="flex justify-end gap-3 mt-4">
             <button
               type="button"
               onClick={handleCancel}
               className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
               disabled={addMemberMutation.isPending}
             >
               Cancel
             </button>
             <button
               type="submit"
               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               disabled={!selectedUser || addMemberMutation.isPending}
             >
               {addMemberMutation.isPending ? 'Adding...' : 'Add Member'}
             </button>
           </div>

           {/* Error Message */}
           {addMemberMutation.isError && (
             <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
               <p className="text-sm text-red-800">
                 Failed to add member. Please try again.
               </p>
             </div>
           )}
         </form>
       </div>
     </div>
   );
};


export default AddMemberModal;
