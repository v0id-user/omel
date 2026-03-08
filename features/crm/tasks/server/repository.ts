import { db } from '@/database/db';
import { contacts, tasks } from '@/database/schemas/app-schema';
import { users } from '@/database/schemas/auth-schema';
import { and, desc, eq, inArray, isNull } from 'drizzle-orm';
import { CreateTaskInput } from '../contracts';
import { TaskWithClient } from '../types';

export async function getTasks(organizationId: string): Promise<TaskWithClient[]> {
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
  organizationId: string,
  createdBy: string,
  input: CreateTaskInput[]
) {
  return db
    .insert(tasks)
    .values(
      input.map(taskInput => ({
        ...taskInput,
        organizationId,
        createdBy,
        updatedBy: createdBy,
      }))
    )
    .returning({ id: tasks.id });
}

export async function updateTask(
  taskId: string,
  updatedBy: string,
  input: Partial<CreateTaskInput>
) {
  return db
    .update(tasks)
    .set({ ...input, updatedBy, updatedAt: new Date() })
    .where(and(eq(tasks.id, taskId), isNull(tasks.deletedAt)))
    .returning({ id: tasks.id });
}

export async function deleteTask(organizationId: string, taskId: string) {
  return db
    .update(tasks)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(
      and(eq(tasks.organizationId, organizationId), eq(tasks.id, taskId), isNull(tasks.deletedAt))
    )
    .returning({ id: tasks.id });
}

export async function deleteTasksByIds(organizationId: string, taskIds: string[]) {
  if (taskIds.length === 0) {
    return [];
  }

  return db
    .update(tasks)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(
      and(
        eq(tasks.organizationId, organizationId),
        inArray(tasks.id, taskIds),
        isNull(tasks.deletedAt)
      )
    )
    .returning({ id: tasks.id });
}
