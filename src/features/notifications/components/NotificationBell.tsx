import { useState } from "react";
import { Bell } from "lucide-react";
import { useUnreadCount } from "../hooks/useNotifications";
import NotificationDropdown from "./NotificationDropdown";
import { useQueryClient } from "@tanstack/react-query";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: unreadCount } = useUnreadCount();

  const displayCount = unreadCount && unreadCount > 9 ? "9+" : unreadCount;
  const queryClient = useQueryClient();

  const handleToggle = () => {
    if (!isOpen && unreadCount && unreadCount > 0) {
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
    }
    setIsOpen(!isOpen);
  };
  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className="relative text-gray-700 hover:text-blue-600 p-1"
      >
        <Bell size={20} />
        {unreadCount !== undefined && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {displayCount}
          </span>
        )}
      </button>

      <NotificationDropdown isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default NotificationBell;
