import { db } from '@/database/db';
import { tasks } from '@/database/schemas/app-schema';
import { eq } from 'drizzle-orm';
import { Task, CreateTaskInput, UpdateTaskInput } from '@/database/types/task';

export async function getTasks(organizationId: string): Promise<Task[]> {
  return await db.$whereNotDeleted(tasks, eq(tasks.organizationId, organizationId));
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
    .set({ ...task_input, updatedBy: updated_by })
    .where(eq(tasks.id, task_id));
}

export async function deleteTask(task_id: string) {
  return await db.$softDelete(tasks, task_id);
}
