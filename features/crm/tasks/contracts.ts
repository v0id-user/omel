import { z } from 'zod';
import { TASK_PRIORITIES, TASK_STATUSES } from '@/database/types/task';

const optionalStringSchema = z.string().optional().nullable();

export const taskStatusSchema = z.enum(TASK_STATUSES);
export const taskPrioritySchema = z.enum(TASK_PRIORITIES);

export const createTaskInputSchema = z.object({
  description: optionalStringSchema,
  category: optionalStringSchema,
  dueDate: z.date().optional().nullable(),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  relatedTo: optionalStringSchema,
  assignedTo: z.string().min(1),
});

export const createTasksInputSchema = z.array(createTaskInputSchema).min(1);

export const updateTaskInputSchema = z.object({
  id: z.string().min(1),
  description: optionalStringSchema,
  category: optionalStringSchema,
  dueDate: z.date().optional().nullable(),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  relatedTo: optionalStringSchema,
  assignedTo: z.string().optional(),
});

export const taskDeleteInputSchema = z.object({
  id: z.string().min(1),
});

export const tasksDeleteManyInputSchema = z.object({
  ids: z.array(z.string()).min(1).max(100),
});

export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskInputSchema>;
