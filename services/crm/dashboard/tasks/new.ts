import { createTasks } from '@/database/queries/tasks';
import { CreateTaskInput, UpdateTaskInput } from '@/database/types/task';

export async function createNewTasks(tasks_input: CreateTaskInput[]) {
  return createTasks(tasks_input);
}

export async function updateTask(task_id: string, task_input: UpdateTaskInput) {
  return updateTask(task_id, task_input);
}

export async function deleteTask(task_id: string) {
  return deleteTask(task_id);
}
