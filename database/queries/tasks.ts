import { db } from '@/database/db';
import { tasks } from '@/database/schemas/app-schema';
import { eq } from 'drizzle-orm';
import { Task, CreateTask } from '@/database/types/task';

export async function getTasks(organizationId: string): Promise<Task[]> {
  return db.select().from(tasks).where(eq(tasks.organizationId, organizationId));
}

export async function createTask(task: CreateTask) {
  return db.insert(tasks).values(task);
}
