import { tasks } from '@/database/schemas/app-schema';

// Base task type from database schema
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;

// Task status options
export const TASK_STATUSES = [
  'pending', // created, not started
  'in_progress', // actively being worked on
  'completed', // done
  'blocked', // something is preventing progress
  'cancelled', // no longer going to be done
] as const;

export const TASK_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

// Form schemas for task operations
export type TaskFormData = {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  assigneeId?: string;
};

export type TaskUpdateFormData = Partial<TaskFormData>;

// Database operation types
export type CreateTaskInput = Omit<
  Task,
  'id' | 'createdBy' | 'updatedBy' | 'organizationId' | 'deletedAt' | 'createdAt' | 'updatedAt'
>;
export type UpdateTaskInput = Partial<CreateTaskInput>;

// Query filters
export type TaskFilters = {
  status?: TaskStatus;
  assigneeId?: string;
  priority?: TaskPriority;
  dueBefore?: Date;
  dueAfter?: Date;
};
