import { Task } from '@/database/types/task';

// Extended type for display purposes
export type TaskWithClient = Task & {
  assignedToName?: string;
  clientName?: string;
};
