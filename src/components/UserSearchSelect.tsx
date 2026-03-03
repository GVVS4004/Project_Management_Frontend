import { useState, useEffect, useRef } from "react";
import { useSearchUsers } from "../hooks/useUser";
import type { User } from "../types/auth.types";
import Avatar from "./Avatar";

interface UserSearchSelectProps {
  label?: string;
  placeholder?: string;
  selectedUser: User | null;
  onSelect: (user: User | null) => void;
  excludeUserIds?: number[];
}

const UserSearchSelect = ({
  label = "Assignee",
  placeholder = "Search by name or email...",
  selectedUser,
  onSelect,
  excludeUserIds = [],
}: UserSearchSelectProps) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data: searchResults = [], isLoading } =
    useSearchUsers(debouncedQuery);

  const availableUsers =
    searchResults.filter((user) => !excludeUserIds.includes(user.id)) ?? [];

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (user: User) => {
    onSelect(user);
    setQuery("");
    setIsOpen(false);
  };

  const handleClear = () => {
    onSelect(null);
    setQuery("");
    setIsOpen(false);
  };

  const getUserDisplayName = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.username;
  };

  return (
    <div ref={wrapperRef} className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      {selectedUser && !isOpen ? (
        <div className="flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
          <div className="flex items-center gap-2">
            <Avatar
              src={selectedUser.profileImageUrl || ""}
              alt={getUserDisplayName(selectedUser)}
            />
            <span className="text-sm text-gray-900">
              {getUserDisplayName(selectedUser)}
            </span>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600"
          >
            &times;
          </button>
        </div>
      ) : (
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
        />
      )}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {debouncedQuery.length < 2 && (
            <p className="px-4 py-3 text-sm text-gray-400">
              Type at least 2 characters to search
            </p>
          )}

          {debouncedQuery.length >= 2 && isLoading && (
            <div className="flex items-center gap-2 px-4 py-3">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600" />
              <span className="text-sm text-gray-400">Searching...</span>
            </div>
          )}

          {debouncedQuery.length >= 2 &&
            !isLoading &&
            availableUsers.length === 0 && (
              <p className="px-4 py-3 text-sm text-gray-400">No users found</p>
            )}

          {availableUsers.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => handleSelect(user)}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
            >
              <Avatar
                src={user.profileImageUrl || ""}
                alt={getUserDisplayName(user)}
              />
              <div className="flex-1 min-w-0">
                <span className="block text-gray-900 truncate">
                  {getUserDisplayName(user)}
                </span>
                <span className="block text-gray-400 text-xs truncate">
                  {user.email}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearchSelect;
