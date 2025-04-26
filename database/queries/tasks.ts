import { db } from '@/database/db';
import { tasks } from '@/database/schemas/app-schema';
import { eq } from 'drizzle-orm';
import { Task, CreateTaskInput, UpdateTaskInput } from '@/database/types/task';

export async function getTasks(organizationId: string): Promise<Task[]> {
  return db.select().from(tasks).where(eq(tasks.organizationId, organizationId));
}

export async function createTasks(tasks_input: CreateTaskInput[]) {
  return db.insert(tasks).values(tasks_input);
}

export async function updateTask(task_id: string, task_input: UpdateTaskInput) {
  return db.update(tasks).set(task_input).where(eq(tasks.id, task_id));
}

export async function deleteTask(task_id: string) {
  return db.delete(tasks).where(eq(tasks.id, task_id));
}
