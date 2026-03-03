import { useState } from "react";
import { TaskStatus } from "../types/task.types";

interface BulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkStatusChange: (status: TaskStatus) => void;
  onBulkDelete: () => void;
}

const BulkActionBar = ({
  selectedCount,
  onClearSelection,
  onBulkStatusChange,
  onBulkDelete,
}: BulkActionBarProps) => {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (selectedCount === 0) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white rounded-lg shadow-xl px-6 py-3
flex items-center gap-4 z-50"
    >
      {/* Selected count */}
      <span className="text-sm font-medium">
        {selectedCount} task{selectedCount > 1 ? "s" : ""} selected
      </span>

      <div className="w-px h-6 bg-gray-600" />

      {/* Move to status */}
      <div className="relative">
        <button
          onClick={() => {
            setShowStatusDropdown(!showStatusDropdown);
            setShowDeleteConfirm(false);
          }}
          className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-md"
        >
          Move to ▾
        </button>

        {showStatusDropdown && (
          <div
            className="absolute bottom-full mb-2 left-0 bg-white text-gray-900 rounded-lg shadow-lg border
border-gray-200 py-1 w-44"
          >
            {Object.values(TaskStatus).map((status) => (
              <button
                key={status}
                onClick={() => {
                  onBulkStatusChange(status);
                  setShowStatusDropdown(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                {status.replace("_", " ")}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Delete */}
      <div className="relative">
        {!showDeleteConfirm ? (
          <button
            onClick={() => {
              setShowDeleteConfirm(true);
              setShowStatusDropdown(false);
            }}
            className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-md"
          >
            Delete
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm text-red-300">Are you sure?</span>
            <button
              onClick={() => {
                onBulkDelete();
                setShowDeleteConfirm(false);
              }}
              className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-md"
            >
              Yes
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-md"
            >
              No
            </button>
          </div>
        )}
      </div>

      <div className="w-px h-6 bg-gray-600" />

      {/* Clear selection */}
      <button
        onClick={onClearSelection}
        className="text-sm text-gray-400 hover:text-white"
      >
        ✕ Clear
      </button>
    </div>
  );
};

export default BulkActionBar;
