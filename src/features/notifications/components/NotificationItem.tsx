import { UserPlus, ArrowRightLeft, MessageCircle, AtSign, X } from "lucide-react";                                                                                                                                                           import Avatar from "../../../components/Avatar";
  import { timeAgo } from "../../../utils/timeAgo";
  import type { Notification } from "../types/notification.types";
  import { NotificationType } from "../types/notification.types";

  interface NotificationItemProps {
    notification: Notification;
    onNavigate: (taskId: number) => void;
    onMarkRead: (id: number) => void;
    onDelete: (id: number) => void;
  }

  const typeIcons = {
    [NotificationType.TASK_ASSIGNED]: UserPlus,
    [NotificationType.STATUS_CHANGED]: ArrowRightLeft,
    [NotificationType.COMMENT_ON_YOUR_TASK]: MessageCircle,
    [NotificationType.MENTIONED_IN_COMMENT]: AtSign,
  };

  const typeColors = {
    [NotificationType.TASK_ASSIGNED]: "text-blue-500",
    [NotificationType.STATUS_CHANGED]: "text-orange-500",
    [NotificationType.COMMENT_ON_YOUR_TASK]: "text-green-500",
    [NotificationType.MENTIONED_IN_COMMENT]: "text-purple-500",
  };

  const NotificationItem = ({ notification, onNavigate, onMarkRead, onDelete }: NotificationItemProps) => {
    const Icon = typeIcons[notification.type];
    const iconColor = typeColors[notification.type];

    const handleClick = () => {
      if (!notification.isRead) {
        onMarkRead(notification.id);
      }
      if (notification.taskId) {
        onNavigate(notification.taskId);
      }
    };

    return (
      <div
        onClick={handleClick}
        className={`flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
          !notification.isRead ? "bg-blue-50" : "bg-white"
        }`}
      >
        <div className={`mt-1 ${iconColor}`}>
          <Icon size={18} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Avatar
              src={notification.actor.profileImageUrl || ""}
              alt={`${notification.actor.firstName} ${notification.actor.lastName}`}
            />
            <span className="text-xs text-gray-500">{timeAgo(notification.createdAt)}</span>
            {!notification.isRead && (
              <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-gray-700 truncate">{notification.message}</p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
          }}
          className="mt-1 text-gray-400 hover:text-red-500 flex-shrink-0"
        >
          <X size={14} />
        </button>
      </div>
    );
  };

  export default NotificationItem;