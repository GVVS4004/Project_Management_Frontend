import type { UserSummary, ApiResponse, PagedResponse } from "../../projects/types/project.types";

export type {UserSummary, ApiResponse, PagedResponse} from "../../projects/types/project.types";

export enum TaskStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    BLOCKED = 'BLOCKED',
    REVIEW = 'REVIEW',
    TESTING = 'TESTING',
    DONE = 'DONE',
    ABANDONED = 'ABANDONED',
}

export enum TaskPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL',
}

export enum TaskType {
    STORY = 'STORY',
    BUG = 'BUG',
    TASK = 'TASK',
    EPIC = 'EPIC',
    DEFECT = 'DEFECT',
    SUBTASK = 'SUBTASK',
}

export interface Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    type: TaskType;
    projectId: number;
    projectName: string;
    createdBy: UserSummary;
    assignedTo: UserSummary | null;
    parentTaskId: number | null;
    parentTaskTitle: string | null;
    dueDate: string | null;
    completedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskRequest {
    title: string;
    description: string;
    priority?: TaskPriority;
    type?: TaskType;
    projectId: number;
    assignedToId?: number | null;
    parentTaskId?: number | null;
    dueDate?: string | null;
}

export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    type?: TaskType;
    priority?: TaskPriority;
    assignedToId?: number | null;
    dueDate?: string | null;
}

export interface TaskFilters {
    search: string;
    status: TaskStatus | 'ALL';
    priority: TaskPriority | 'ALL';
    type: TaskType | 'ALL';
    assigneeId: number | 'ALL';
}

export interface KanbanColumn {
    status: TaskStatus;
    title: string;
    tasks: Task[];
}