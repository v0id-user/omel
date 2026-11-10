import * as repository from './repository';
import { CreateTaskInput, UpdateTaskInput } from '../contracts';
import { logCRMActivity } from '@/features/crm/activity/server/service';
import { assertReferencesInOrganization } from '@/features/crm/shared/server/ownership';

export async function getTasksForOrganization(organizationId: string) {
  return repository.getTasks(organizationId);
}

export async function createNewTasks(
  organizationId: string,
  createdBy: string,
  input: CreateTaskInput[]
) {
  await assertReferencesInOrganization(organizationId, {
    contactIds: input.map(task => task.relatedTo),
    memberIds: input.map(task => task.assignedTo),
  });
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

export async function updateTask(
  organizationId: string,
  updatedBy: string,
  input: UpdateTaskInput
) {
  const { id: taskId, ...taskInput } = input;
  await assertReferencesInOrganization(organizationId, {
    contactIds: [taskInput.relatedTo],
    memberIds: [taskInput.assignedTo],
  });
  const [result] = await repository.updateTask(organizationId, taskId, updatedBy, taskInput);

  if (result?.id) {
    await logCRMActivity({
      actorId: updatedBy,
      targetId: result.id,
      targetType: 'task',
      action: 'updated',
      metadata: { fields: Object.keys(taskInput) },
    });
  }

  return result;
}

export async function deleteTask(organizationId: string, taskId: string, deletedBy: string) {
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
  deletedBy: string
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
