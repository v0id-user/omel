import { Task } from '@/database/types/task';

export type TaskRecord = Task;

export type TaskWithClient = TaskRecord & {
  assignedToName?: string;
  clientName?: string;
};
