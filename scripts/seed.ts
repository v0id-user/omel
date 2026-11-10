// Creates a local demo account with sample CRM data. Safe to run more than once.
// Usage: bun run db:seed  (reads DATABASE_URL from .env.local)
import { and, eq } from 'drizzle-orm';
import { auth } from '@/lib/betterauth/auth';
import { db } from '@/database/db';
import { members, users } from '@/database/schemas/auth-schema';
import { contacts } from '@/database/schemas/app-schema';
import { createContact } from '@/features/crm/contacts/server/repository';
import { createDeal } from '@/features/crm/deals/server/repository';
import { createTasks } from '@/features/crm/tasks/server/repository';
import { createInteraction } from '@/features/crm/interactions/server/repository';

const email = process.env.SEED_EMAIL ?? 'demo@omel.test';
const password = process.env.SEED_PASSWORD ?? 'omel-demo-1234';

if (!process.env.DATABASE_URL?.includes('localhost')) {
  console.error('Refusing to seed: DATABASE_URL does not point at localhost.');
  process.exit(1);
}

async function findOrCreateAccount() {
  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing) {
    const [membership] = await db
      .select({ organizationId: members.organizationId })
      .from(members)
      .where(eq(members.userId, existing.id))
      .limit(1);
    if (!membership) throw new Error(`${email} exists but has no organization`);
    return { userId: existing.id, organizationId: membership.organizationId, created: false };
  }

  const { user } = await auth.api.signUpEmail({
    body: { email, password, name: 'حساب تجريبي' },
  });
  const organization = await auth.api.createOrganization({
    body: { name: 'شركة أوميل التجريبية', slug: `omel-demo-${Date.now()}`, userId: user.id },
  });
  if (!organization?.id) throw new Error('Organization was not created');
  return { userId: user.id, organizationId: organization.id, created: true };
}

async function seedData(organizationId: string, userId: string) {
  const existing = await db
    .select({ id: contacts.id })
    .from(contacts)
    .where(and(eq(contacts.organizationId, organizationId), eq(contacts.source, 'manual')))
    .limit(3);
  if (existing.length >= 3) {
    console.log('Sample data already present, skipping.');
    return;
  }

  const people = [
    {
      name: 'خالد الحربي',
      email: 'khalid@alnahda.sa',
      phone: '+966551000001',
      city: 'الرياض',
      status: 'customer' as const,
      contactType: 'company' as const,
    },
    {
      name: 'نورة القحطاني',
      email: 'noura@example.sa',
      phone: '+966551000002',
      city: 'جدة',
      status: 'prospect' as const,
      contactType: 'person' as const,
    },
    {
      name: 'عبدالله الشهري',
      email: 'abdullah@fanar.sa',
      phone: '+966551000003',
      city: 'الدمام',
      status: 'lead' as const,
      contactType: 'company' as const,
    },
    {
      name: 'ريم العتيبي',
      email: 'reem@example.sa',
      phone: '+966551000004',
      city: 'الخبر',
      status: 'lead' as const,
      contactType: 'person' as const,
    },
  ];

  const contactIds: string[] = [];
  for (const person of people) {
    const [row] = await createContact(organizationId, userId, {
      ...person,
      country: 'السعودية',
      source: 'manual',
    });
    contactIds.push(row.id);
  }

  const dealRows = [
    {
      title: 'اشتراك سنوي - الباقة المتقدمة',
      amount: '48000',
      stage: 'negotiation' as const,
      probability: 70,
      contactId: contactIds[0],
    },
    {
      title: 'تجربة لمدة ثلاثة أشهر',
      amount: '9000',
      stage: 'proposal' as const,
      probability: 50,
      contactId: contactIds[1],
    },
    {
      title: 'توريد ترخيص للفريق',
      amount: '15000',
      stage: 'qualified' as const,
      probability: 30,
      contactId: contactIds[2],
    },
    {
      title: 'تجديد عقد الدعم',
      amount: '22000',
      stage: 'won' as const,
      status: 'won' as const,
      probability: 100,
      contactId: contactIds[0],
    },
  ];
  const dealIds: string[] = [];
  for (const deal of dealRows) {
    const [row] = await createDeal(organizationId, userId, {
      ...deal,
      currency: 'SAR',
      ownerId: userId,
    });
    dealIds.push(row.id);
  }

  const day = 24 * 60 * 60 * 1000;
  await createTasks(organizationId, userId, [
    {
      description: 'إرسال عرض السعر المحدث لخالد',
      priority: 'high',
      dueDate: new Date(Date.now() + day),
      relatedTo: contactIds[0],
      assignedTo: userId,
    },
    {
      description: 'متابعة نورة بخصوص التجربة',
      priority: 'medium',
      dueDate: new Date(Date.now() + 3 * day),
      relatedTo: contactIds[1],
      assignedTo: userId,
    },
    {
      description: 'تجهيز عرض تقديمي لشركة فنار',
      priority: 'low',
      dueDate: new Date(Date.now() - day),
      relatedTo: contactIds[2],
      assignedTo: userId,
    },
  ]);

  await createInteraction(organizationId, userId, {
    type: 'call',
    subject: 'مكالمة تعريفية',
    content: 'مهتم بالباقة المتقدمة لفريق من ٢٠ شخص.',
    contactId: contactIds[0],
    dealId: dealIds[0],
  });
  await createInteraction(organizationId, userId, {
    type: 'meeting',
    subject: 'اجتماع عرض المنتج',
    content: 'تم عرض لوحة التحكم وإدارة الصفقات.',
    contactId: contactIds[1],
    dealId: dealIds[1],
  });
  await createInteraction(organizationId, userId, {
    type: 'email',
    subject: 'إرسال العقد',
    content: 'أُرسل العقد للتوقيع.',
    contactId: contactIds[0],
    dealId: dealIds[3],
  });

  console.log(
    `Added ${people.length} contacts, ${dealRows.length} deals, 3 tasks and 3 activities.`
  );
}

const { userId, organizationId, created } = await findOrCreateAccount();
await seedData(organizationId, userId);
console.log(
  created ? `Demo account created: ${email} / ${password}` : `Seeded the existing account ${email}.`
);
process.exit(0);
