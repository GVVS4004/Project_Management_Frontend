import type { UserSummary } from "./task.types";

export interface Comment {
    id: number;
    content: string;
    author: UserSummary;
    parentCommentId: number | null;
    replies: Comment[];
    isEdited: boolean;
    isDeleted: boolean;
    deletedAt: string | null;
    deletedBy: number | null;
    createdAt: string;
    updatedAt: string;
    depth: number;
    taskId: number;
    replyCount: number;
}

export interface CreateCommentRequest {
    content: string;
    parentCommentId?: number | null;
}

export interface UpdateCommentRequest {
    content: string;
}