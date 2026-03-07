import * as repository from './repository';
import { CreateTaskInput, UpdateTaskInput } from '../contracts';

export async function getTasksForOrganization(organizationId: string) {
  return repository.getTasks(organizationId);
}

export async function createNewTasks(
  organizationId: string,
  createdBy: string,
  input: CreateTaskInput[]
) {
  return repository.createTasks(organizationId, createdBy, input);
}

export async function updateTask(taskId: string, updatedBy: string, input: UpdateTaskInput) {
  const { id, ...taskInput } = input;
  return repository.updateTask(taskId, updatedBy, taskInput);
}

export async function deleteTask(organizationId: string, taskId: string) {
  return repository.deleteTask(organizationId, taskId);
}

export async function deleteTasksByIds(organizationId: string, taskIds: string[]) {
  return repository.deleteTasksByIds(organizationId, taskIds);
}
