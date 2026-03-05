import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import Avatar from "../Avatar";

interface MentionListProps {
  items: Array<{
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    profileImageUrl: string | null;
  }>;
  command: (item: { id: string; label: string }) => void;
}

const MentionList = forwardRef<any, MentionListProps>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
      setSelectedIndex(0);
    }, [items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        if (event.key === "ArrowUp") {
          setSelectedIndex((prev) => (prev + items.length - 1) % items.length);
          return true;
        }
        if (event.key === "ArrowDown") {
          setSelectedIndex((prev) => (prev + 1) % items.length);
          return true;
        }
        if (event.key === "Enter") {
          if (items[selectedIndex]) {
            const item = items[selectedIndex];
            command({
              id: item.username,
              label: `${item.firstName} ${item.lastName}`,
            });
          }
          return true;
        }
        return false;
      },
    }));

    if (items.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
          <p className="text-sm text-gray-500 px-2">No users found</p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-1 max-h-48 overflow-y-auto">
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() =>
              command({
                id: item.username,
                label: `${item.firstName} ${item.lastName}`,
              })
            }
            className={`flex items-center gap-2 w-full px-3 py-2 text-left text-sm ${
              index === selectedIndex
                ? "bg-indigo-50 text-indigo-700"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Avatar
              src={item.profileImageUrl || ""}
              alt={`${item.firstName} ${item.lastName}`}
            />
            <div>
              <p className="font-medium">
                {item.firstName} {item.lastName}
              </p>
              <p className="text-xs text-gray-400">@{item.username}</p>
            </div>
          </button>
        ))}
      </div>
    );
  },
);

MentionList.displayName = "MentionList";

export default MentionList;
