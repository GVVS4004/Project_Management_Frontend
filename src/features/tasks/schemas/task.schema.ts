import {z} from 'zod';
import { TaskPriority, TaskType } from '../types/task.types';

export const createTaskSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(500, 'Title must be less than 500 characters')
        .trim(),
    description: z
        .string()
        .max(5000, 'Description must be less than 5000 characters')
        .trim()
        .or(z.literal('')),
    type: z.nativeEnum(TaskType).optional(),
    priority: z.nativeEnum(TaskPriority).optional(),
    assignedToId: z.number().optional().nullable(),
    dueDate : z.string().optional().or(z.literal('')),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
    title: z.string().min(1, 'Title is required').max(500, 'Title must be less than 500 characters').trim(),
});

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;