import { db } from '@/database/db';
import { members, organizations } from '@/database/schema';
import { eq } from 'drizzle-orm';

export async function getFirstOrganizationByUserId(userID: string) {
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

export async function getOrganizationById(organizationId: string) {
  const org = (
    await db.select().from(organizations).where(eq(organizations.id, organizationId))
  )[0];
  if (!org) {
    throw new Error('Organization not found');
  }
  return org;
}
