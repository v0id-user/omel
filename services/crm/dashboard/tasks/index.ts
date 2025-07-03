import {
  getTasks,
  createTasks,
  updateTask as updateTaskQuery,
  deleteTask as deleteTaskQuery,
} from '@/database/queries/tasks';
import { CreateTaskInput, UpdateTaskInput } from '@/database/types/task';

export async function getTasksForOrganization(organization_id: string) {
  return await getTasks(organization_id);
}

export async function createNewTasks(
  organization_id: string,
  created_by: string,
  tasks_input: CreateTaskInput[]
) {
  return await createTasks(organization_id, created_by, tasks_input);
}

export async function updateTask(task_id: string, updated_by: string, task_input: UpdateTaskInput) {
  return await updateTaskQuery(task_id, updated_by, task_input);
}

export async function deleteTask(task_id: string) {
  return await deleteTaskQuery(task_id);
}
