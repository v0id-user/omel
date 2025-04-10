import { db } from '@/database/db';
import { members, organizations } from '@/database/schema';
import { eq } from 'drizzle-orm';

export async function getOrganization(userID: string) {
  const orgs = await db
    .select()
    .from(members)
    .innerJoin(organizations, eq(members.organizationId, organizations.id))
    .where(eq(members.userId, userID));

  if (!orgs.length) {
    throw new Error('User must be in an organization');
  }

  if (orgs.length > 1) {
    throw new Error('User must be in only one organization');
  }

  return orgs[0].organizations;
}
