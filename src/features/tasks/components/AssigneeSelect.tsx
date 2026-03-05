import { useState, useRef, useEffect } from "react";
import { useSearchUsers } from "../../../hooks/useUser";
interface AssigneeSelectProps {
  value: number | null | undefined;
  selectedName?: string;
  onChange: (userId: number | null) => void;
}


const AssigneeSelect = ({ value, selectedName, onChange}: AssigneeSelectProps) => {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { data: users=[], isLoading } = useSearchUsers(query);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const displayValue = value && selectedName ? selectedName : "";

    return (
        <div ref={wrapperRef} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>

            <input
                type="text"
                placeholder="Search users..."
                value={isOpen ? query : displayValue}
                onChange={(e)=>{
                    setQuery(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={()=> setIsOpen(true)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text sm"
            />

            {value && (
                <button
                    type="button"
                    onClick={()=>{
                        onChange(null);
                        setQuery('');
                    }}
                    className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                >
                    &times;
                </button>
            )}

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {isLoading && <div className="p-2 text-sm text-gray-500">Loading...</div>}
                    {!isLoading && users.length === 0 && query && (
                        <div className="p-2 text-sm text-gray-500">No users found</div>
                    )}
                    {users.map((user) => (
                        <button
                            key={user.id}
                            type="button"
                            onClick={() => {
                                onChange(user.id);
                                setQuery('');
                                setIsOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 hover:text-indigo-700"
                        >
                            {user.firstName} {user.lastName} (@{user.username})
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AssigneeSelect;