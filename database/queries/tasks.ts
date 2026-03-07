import { db } from '@/database/db';
import { tasks } from '@/database/schemas/app-schema';
import { contacts } from '@/database/schemas/app-schema';
import { users } from '@/database/schemas/auth-schema';
import { and, eq, isNull, inArray, desc } from 'drizzle-orm';
import { Task, CreateTaskInput, UpdateTaskInput } from '@/database/types/task';

export async function getTasks(
  organizationId: string
): Promise<(Task & { assignedToName?: string; clientName?: string })[]> {
  const result = await db
    .select({
      task: tasks,
      assignedToName: users.name,
      clientName: contacts.name,
    })
    .from(tasks)
    .leftJoin(users, eq(tasks.assignedTo, users.id))
    .leftJoin(contacts, eq(tasks.relatedTo, contacts.id))
    .where(and(eq(tasks.organizationId, organizationId), isNull(tasks.deletedAt)))
    .orderBy(desc(tasks.createdAt));

  return result.map(item => ({
    ...item.task,
    assignedToName: item.assignedToName ?? undefined,
    clientName: item.clientName ?? undefined,
  }));
}

export async function createTasks(
  organization_id: string,
  created_by: string,
  tasks_input: CreateTaskInput[]
) {
  return await db.insert(tasks).values(
    tasks_input.map(task => ({
      ...task,
      organizationId: organization_id,
      createdBy: created_by,
      updatedBy: created_by,
    }))
  );
}

export async function updateTask(task_id: string, updated_by: string, task_input: UpdateTaskInput) {
  return await db
    .update(tasks)
    .set({ ...task_input, updatedBy: updated_by, updatedAt: new Date() })
    .where(and(eq(tasks.id, task_id), isNull(tasks.deletedAt)))
    .returning({ id: tasks.id });
}

export async function deleteTask(organizationId: string, task_id: string) {
  return await db
    .update(tasks)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(and(eq(tasks.organizationId, organizationId), eq(tasks.id, task_id), isNull(tasks.deletedAt)))
    .returning({ id: tasks.id });
}

export async function deleteTasksByIds(organizationId: string, taskIds: string[]) {
  if (taskIds.length === 0) return [];

  return await db
    .update(tasks)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(
      and(eq(tasks.organizationId, organizationId), inArray(tasks.id, taskIds), isNull(tasks.deletedAt))
    )
    .returning({ id: tasks.id });
}
