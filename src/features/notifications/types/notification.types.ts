import type { UserSummary } from "../../projects/types/project.types";

export enum NotificationType {
    TASK_ASSIGNED = 'TASK_ASSIGNED',
    STATUS_CHANGED = 'STATUS_CHANGED',
    COMMENT_ON_YOUR_TASK = 'COMMENT_ON_YOUR_TASK',
    MENTIONED_IN_COMMENT = 'MENTIONED_IN_COMMENT'
}

export interface Notification {
    id: number;
    type: NotificationType;
    message: string;
    isRead: boolean;
    actor: UserSummary;
    taskId: number | null;
    commentId: number | null;
    createdAt: string;
}