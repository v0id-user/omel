import { db } from '@/database/db';
import { activityLogs } from '@/database/schemas/app-schema';

type ActivityLogInput = {
  actorId: string;
  actorType?: string;
  targetId: string;
  targetType: string;
  action: string;
  metadata?: Record<string, unknown>;
};

export async function logCRMActivity({
  actorId,
  actorType = 'user',
  targetId,
  targetType,
  action,
  metadata,
}: ActivityLogInput) {
  return db.insert(activityLogs).values({
    actorType,
    actorId,
    targetType,
    targetId,
    action,
    metadata,
  });
}
