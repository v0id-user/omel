import { tasks } from '@/database/schemas/app-schema';

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;

// For creating a new task, we can omit auto-generated fields
export type CreateTask = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;

export const TASK_STATUSES = [
  'pending', // created, not started
  'in_progress', // actively being worked on
  'completed', // done
  'blocked', // something is preventing progress
  'cancelled', // no longer going to be done
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];
