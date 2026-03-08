import * as repository from './repository';
import { CreateTaskInput, UpdateTaskInput } from '../contracts';
import { logCRMActivity } from '@/features/crm/activity/server/service';

export async function getTasksForOrganization(organizationId: string) {
  return repository.getTasks(organizationId);
}

export async function createNewTasks(
  organizationId: string,
  createdBy: string,
  input: CreateTaskInput[]
) {
  const results = await repository.createTasks(organizationId, createdBy, input);

  await Promise.all(
    results.map((result, index) =>
      logCRMActivity({
        actorId: createdBy,
        targetId: result.id,
        targetType: 'task',
        action: 'created',
        metadata: {
          description: input[index]?.description ?? null,
          assignedTo: input[index]?.assignedTo ?? null,
        },
      })
    )
  );

  return results;
}

export async function updateTask(taskId: string, updatedBy: string, input: UpdateTaskInput) {
  const { id, ...taskInput } = input;
  const [result] = await repository.updateTask(taskId, updatedBy, taskInput);

  if (result?.id) {
    await logCRMActivity({
      actorId: updatedBy,
      targetId: result.id,
      targetType: 'task',
      action: 'updated',
      metadata: taskInput,
    });
  }

  return result;
}

export async function deleteTask(
  organizationId: string,
  taskId: string,
  deletedBy: string = organizationId
) {
  const [result] = await repository.deleteTask(organizationId, taskId);

  if (result?.id) {
    await logCRMActivity({
      actorId: deletedBy,
      targetId: result.id,
      targetType: 'task',
      action: 'deleted',
    });
  }

  return result;
}

export async function deleteTasksByIds(
  organizationId: string,
  taskIds: string[],
  deletedBy: string = organizationId
) {
  const results = await repository.deleteTasksByIds(organizationId, taskIds);

  await Promise.all(
    results.map(result =>
      logCRMActivity({
        actorId: deletedBy,
        targetId: result.id,
        targetType: 'task',
        action: 'deleted',
      })
    )
  );

  return results;
}
