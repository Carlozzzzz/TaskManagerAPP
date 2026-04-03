// src/schemas/taskSchemas.ts
import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(50, 'Title cannot exceed 50 characters'),
  description: z
    .string()
    .max(200, 'Description cannot exceed 200 characters')
    .default(''),
  dueDate: z
    .string()
    .min(1, 'Due date is required')
    .refine((date) => new Date(date) > new Date(), 'Due date cannot be in the past'),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskStatusSchema = z.object({
  status: z.enum(['todo', 'in-progress', 'done']),
});

export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;
