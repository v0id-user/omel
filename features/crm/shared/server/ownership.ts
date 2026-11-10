import { TRPCError } from '@trpc/server';
import { and, eq, inArray, isNull } from 'drizzle-orm';
import { db } from '@/database/db';
import { contacts, deals, tasks } from '@/database/schemas/app-schema';
import { members } from '@/database/schemas/auth-schema';

type References = {
  contactIds?: (string | null | undefined)[];
  dealIds?: (string | null | undefined)[];
  taskIds?: (string | null | undefined)[];
  memberIds?: (string | null | undefined)[];
};

function unique(ids: (string | null | undefined)[] = []) {
  return [...new Set(ids.filter((id): id is string => Boolean(id)))];
}

function rejectForeignReference(): never {
  throw new TRPCError({
    code: 'BAD_REQUEST',
    message: 'أحد السجلات المرتبطة غير موجود في مؤسستك',
  });
}

// Every id a client links to (contact, deal, task, assignee) must belong to the caller's organization.
export async function assertReferencesInOrganization(organizationId: string, refs: References) {
  const contactIds = unique(refs.contactIds);
  const dealIds = unique(refs.dealIds);
  const taskIds = unique(refs.taskIds);
  const memberIds = unique(refs.memberIds);

  const [foundContacts, foundDeals, foundTasks, foundMembers] = await Promise.all([
    contactIds.length
      ? db
          .select({ id: contacts.id })
          .from(contacts)
          .where(
            and(
              eq(contacts.organizationId, organizationId),
              inArray(contacts.id, contactIds),
              isNull(contacts.deletedAt)
            )
          )
      : [],
    dealIds.length
      ? db
          .select({ id: deals.id })
          .from(deals)
          .where(
            and(
              eq(deals.organizationId, organizationId),
              inArray(deals.id, dealIds),
              isNull(deals.deletedAt)
            )
          )
      : [],
    taskIds.length
      ? db
          .select({ id: tasks.id })
          .from(tasks)
          .where(
            and(
              eq(tasks.organizationId, organizationId),
              inArray(tasks.id, taskIds),
              isNull(tasks.deletedAt)
            )
          )
      : [],
    memberIds.length
      ? db
          .select({ id: members.userId })
          .from(members)
          .where(
            and(eq(members.organizationId, organizationId), inArray(members.userId, memberIds))
          )
      : [],
  ]);

  if (
    foundContacts.length !== contactIds.length ||
    foundDeals.length !== dealIds.length ||
    foundTasks.length !== taskIds.length ||
    foundMembers.length !== memberIds.length
  ) {
    rejectForeignReference();
  }
}

export async function getMemberRole(organizationId: string, userId: string) {
  const [membership] = await db
    .select({ role: members.role })
    .from(members)
    .where(and(eq(members.organizationId, organizationId), eq(members.userId, userId)))
    .limit(1);

  return membership?.role ?? null;
}
