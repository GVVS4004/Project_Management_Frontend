import { useRef, useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { Bell, CheckCheck } from "lucide-react";
  import NotificationItem from "./NotificationItem";
  import {
    useUnreadNotifications,
    useNotifications,
    useMarkAsRead,
    useMarkAllAsRead,
    useDeleteNotification,
  } from "../hooks/useNotifications";

  interface NotificationDropdownProps {
    isOpen: boolean;
    onClose: () => void;
  }

  const NotificationDropdown = ({ isOpen, onClose }: NotificationDropdownProps) => {
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [showAll, setShowAll] = useState(false);

    const { data: unreadNotifications, isLoading: unreadLoading } = useUnreadNotifications();
    const { data: allNotifications, isLoading: allLoading } = useNotifications();

    const markAsRead = useMarkAsRead();
    const markAllAsRead = useMarkAllAsRead();
    const deleteNotification = useDeleteNotification();

    const notifications = showAll ? allNotifications : unreadNotifications;
    const isLoading = showAll ? allLoading : unreadLoading;

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    const handleNavigate = (taskId: number) => {
      navigate(`/tasks/${taskId}`);
      onClose();
    };

    if (!isOpen) return null;

    return (
      <div
        ref={dropdownRef}
        className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
      >
        <div className="flex items-center justify-between p-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Notifications</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-xs text-indigo-600 hover:text-indigo-800"
            >
              {showAll ? "Unread only" : "Show all"}
            </button>
            <button
              onClick={() => markAllAsRead.mutate()}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-600"
              title="Mark all as read"
            >
              <CheckCheck size={14} />
            </button>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-gray-500">Loading...</div>
          ) : !notifications || notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell size={24} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">
                {showAll ? "No notifications yet" : "No unread notifications"}
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onNavigate={handleNavigate}
                onMarkRead={(id) => markAsRead.mutate(id)}
                onDelete={(id) => deleteNotification.mutate(id)}
              />
            ))
          )}
        </div>
      </div>
    );
  };

  export default NotificationDropdown;