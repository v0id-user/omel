import { describe, it, expect, mock, beforeEach } from 'bun:test';

const contactStore: Record<string, any> = {};
let contactIdCounter = 0;

const taskStore: Record<string, any> = {};
let taskIdCounter = 0;

mock.module('@/lib/betterauth/auth', () => ({
  auth: {
    api: {
      getSession: () => Promise.resolve(null),
    },
  },
}));

mock.module('@/lib/ratelimt', () => ({
  ratelimit: {
    limit: () => Promise.resolve({ success: true }),
  },
}));

mock.module('superjson', () => ({
  default: {
    serialize: (value: unknown) => value,
    deserialize: (value: unknown) => value,
  },
}));

mock.module('@/utils/emails', () => ({
  validateEmail: () => Promise.resolve(true),
}));

mock.module('@/utils/phone/validate', () => ({
  validatePhoneGeneral: () => undefined,
  validatePhoneArab: () => true,
}));

mock.module('@/features/crm/contacts/server/repository', () => ({
  createContact: mock((_orgId: string, _createdBy: string, input: any) => {
    const id = `contact-${++contactIdCounter}`;
    contactStore[id] = {
      id,
      ...input,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return Promise.resolve(contactStore[id]);
  }),
  updateContact: mock((contactId: string, _updatedBy: string, input: any) => {
    if (contactStore[contactId]) {
      Object.assign(contactStore[contactId], input, { updatedAt: new Date() });
    }
    return Promise.resolve(contactStore[contactId]);
  }),
  getContactsByPage: mock((orgId: string, page: number, limit: number) => {
    const all = Object.values(contactStore).filter((c: any) => !c.deletedAt);
    const start = (page - 1) * limit;
    const data = all.slice(start, start + limit);
    return Promise.resolve({
      data,
      total: all.length,
      currentPage: page,
      totalPages: Math.ceil(all.length / limit),
    });
  }),
  getTotalContactPages: mock((_orgId: string, length: number) => {
    const all = Object.values(contactStore).filter((c: any) => !c.deletedAt);
    return Promise.resolve(Math.ceil(all.length / length));
  }),
  getContactsByIds: mock((_orgId: string, ids: string[]) => {
    return Promise.resolve(ids.map(id => contactStore[id]).filter(Boolean));
  }),
  getBulkContacts: mock((_orgId: string, limit: number) => {
    const all = Object.values(contactStore).filter((c: any) => !c.deletedAt);
    return Promise.resolve(all.slice(0, limit));
  }),
  searchContacts: mock((_orgId: string, term: string, page: number, limit: number) => {
    const all = Object.values(contactStore).filter(
      (c: any) => !c.deletedAt && c.name?.toLowerCase().includes(term.toLowerCase())
    );
    const start = (page - 1) * limit;
    return Promise.resolve({
      data: all.slice(start, start + limit),
      total: all.length,
      currentPage: page,
      totalPages: Math.ceil(all.length / limit),
    });
  }),
  deleteContact: mock((_orgId: string, contactId: string) => {
    if (contactStore[contactId]) {
      contactStore[contactId].deletedAt = new Date();
    }
    return Promise.resolve([{ id: contactId }]);
  }),
  deleteContactsByIds: mock((_orgId: string, ids: string[]) => {
    for (const id of ids) {
      if (contactStore[id]) contactStore[id].deletedAt = new Date();
    }
    return Promise.resolve(ids.map(id => ({ id })));
  }),
}));

mock.module('@/features/crm/tasks/server/repository', () => ({
  getTasks: mock((_orgId: string) => {
    return Promise.resolve(Object.values(taskStore).filter((t: any) => !t.deletedAt));
  }),
  createTasks: mock((_orgId: string, _createdBy: string, input: any[]) => {
    const created = input.map(t => {
      const id = `task-${++taskIdCounter}`;
      taskStore[id] = { id, ...t, deletedAt: null, createdAt: new Date(), updatedAt: new Date() };
      return taskStore[id];
    });
    return Promise.resolve(created);
  }),
  updateTask: mock((taskId: string, _updatedBy: string, input: any) => {
    if (taskStore[taskId]) {
      Object.assign(taskStore[taskId], input, { updatedAt: new Date() });
    }
    return Promise.resolve([{ id: taskId }]);
  }),
  deleteTask: mock((_orgId: string, taskId: string) => {
    if (taskStore[taskId]) taskStore[taskId].deletedAt = new Date();
    return Promise.resolve([{ id: taskId }]);
  }),
  deleteTasksByIds: mock((_orgId: string, ids: string[]) => {
    for (const id of ids) {
      if (taskStore[id]) taskStore[id].deletedAt = new Date();
    }
    return Promise.resolve(ids.map(id => ({ id })));
  }),
}));

mock.module('@/features/auth/server/service', () => ({
  createNewCRM: mock(() => Promise.resolve({ status: 'ok' })),
}));

import type { TRPCContext } from '@/trpc/init';
import { appRouter } from '@/trpc/routers/_app';

function createAuthenticatedContext(): TRPCContext {
  return {
    session: {
      session: {
        id: 'e2e-session',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'e2e-user-id',
        expiresAt: new Date(Date.now() + 86400000),
        token: 'e2e-token',
        activeOrganizationId: 'e2e-org-id',
      },
      user: {
        id: 'e2e-user-id',
        name: 'E2E User',
        email: 'e2e@example.com',
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        twoFactorEnabled: false,
      },
    },
    req: undefined,
    resHeaders: new Headers(),
  } as TRPCContext;
}

describe('E2E: Contact CRUD flow', () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    for (const k of Object.keys(contactStore)) delete contactStore[k];
    contactIdCounter = 0;
    caller = appRouter.createCaller(createAuthenticatedContext());
  });

  it('creates a contact, retrieves by page, updates, searches, then deletes', async () => {
    await caller.crm.dashboard.contact.new({
      name: 'Ahmed Ali',
      email: 'ahmed@example.com',
      phone: '+966511111111',
    });

    const page = await caller.crm.dashboard.contact.getByPage({ page: 1, limit: 10 });
    expect(page.data.length).toBe(1);
    expect(page.data[0].name).toBe('Ahmed Ali');
    expect(page.total).toBe(1);
    expect(page.currentPage).toBe(1);

    const contactId = page.data[0].id;

    await caller.crm.dashboard.contact.update({
      id: contactId,
      name: 'Ahmed Updated',
    });
    expect(contactStore[contactId].name).toBe('Ahmed Updated');

    const searchResults = await caller.crm.dashboard.contact.search({
      searchTerm: 'Ahmed',
      page: 1,
      limit: 20,
    });
    expect(searchResults.data.length).toBe(1);
    expect(searchResults.data[0].name).toBe('Ahmed Updated');

    await caller.crm.dashboard.contact.delete({ id: contactId });
    expect(contactStore[contactId].deletedAt).toBeDefined();

    const afterDelete = await caller.crm.dashboard.contact.getByPage({ page: 1, limit: 10 });
    expect(afterDelete.data.length).toBe(0);
    expect(afterDelete.total).toBe(0);
  });

  it('creates multiple contacts and bulk-fetches them', async () => {
    await caller.crm.dashboard.contact.new({
      name: 'Contact A',
      email: 'a@example.com',
      phone: '+966511111111',
    });
    await caller.crm.dashboard.contact.new({
      name: 'Contact B',
      email: 'b@example.com',
      phone: '+966522222222',
    });

    const bulk = await caller.crm.dashboard.contact.getBulk({ limit: 50 });
    expect(bulk.length).toBe(2);
  });

  it('bulk-deletes multiple contacts', async () => {
    await caller.crm.dashboard.contact.new({
      name: 'Del A',
      email: 'dela@example.com',
      phone: '+966511111111',
    });
    await caller.crm.dashboard.contact.new({
      name: 'Del B',
      email: 'delb@example.com',
      phone: '+966522222222',
    });

    const allContacts = await caller.crm.dashboard.contact.getBulk({ limit: 50 });
    const ids = allContacts.map((c: any) => c.id);

    await caller.crm.dashboard.contact.deleteMany({ ids });

    const afterDelete = await caller.crm.dashboard.contact.getByPage({ page: 1, limit: 10 });
    expect(afterDelete.total).toBe(0);
  });
});

describe('E2E: Task CRUD flow', () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    for (const k of Object.keys(taskStore)) delete taskStore[k];
    taskIdCounter = 0;
    caller = appRouter.createCaller(createAuthenticatedContext());
  });

  it('creates tasks, retrieves, updates, then deletes', async () => {
    await caller.crm.dashboard.task.new([
      { description: 'Task 1', assignedTo: 'e2e-user-id', status: 'pending', priority: 'low' },
      { description: 'Task 2', assignedTo: 'e2e-user-id', status: 'pending', priority: 'high' },
    ]);

    const tasks = await caller.crm.dashboard.task.getTasks();
    expect(tasks.length).toBe(2);

    const taskId = tasks[0].id;
    await caller.crm.dashboard.task.update({
      id: taskId,
      status: 'completed',
    });
    expect(taskStore[taskId].status).toBe('completed');

    await caller.crm.dashboard.task.delete({ id: taskId });
    expect(taskStore[taskId].deletedAt).toBeDefined();

    const remaining = await caller.crm.dashboard.task.getTasks();
    expect(remaining.length).toBe(1);
  });

  it('bulk-deletes tasks', async () => {
    await caller.crm.dashboard.task.new([
      { description: 'Bulk A', assignedTo: 'e2e-user-id' },
      { description: 'Bulk B', assignedTo: 'e2e-user-id' },
      { description: 'Bulk C', assignedTo: 'e2e-user-id' },
    ]);

    const tasks = await caller.crm.dashboard.task.getTasks();
    const ids = tasks.map((t: any) => t.id);

    await caller.crm.dashboard.task.deleteMany({ ids });

    const remaining = await caller.crm.dashboard.task.getTasks();
    expect(remaining.length).toBe(0);
  });
});

describe('E2E: Unauthenticated access is blocked', () => {
  it('rejects contact operations without auth', async () => {
    const unauthCaller = appRouter.createCaller({
      session: null,
      req: undefined,
      resHeaders: new Headers(),
    } as TRPCContext);

    try {
      await unauthCaller.crm.dashboard.contact.getByPage({ page: 1, limit: 10 });
      throw new Error('Should have thrown');
    } catch (err: any) {
      expect(err.code).toBe('UNAUTHORIZED');
    }
  });

  it('rejects task operations without auth', async () => {
    const unauthCaller = appRouter.createCaller({
      session: null,
      req: undefined,
      resHeaders: new Headers(),
    } as TRPCContext);

    try {
      await unauthCaller.crm.dashboard.task.getTasks();
      throw new Error('Should have thrown');
    } catch (err: any) {
      expect(err.code).toBe('UNAUTHORIZED');
    }
  });
});
