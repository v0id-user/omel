import { beforeEach, describe, expect, it, mock } from 'bun:test';

const mockListInteractionsForOrganization = mock(() => Promise.resolve([]));
const mockGetInteractionById = mock(() => Promise.resolve(null));
const mockCreateInteraction = mock(() => Promise.resolve([{ id: 'interaction-1' }]));
const mockUpdateInteraction = mock(() => Promise.resolve([{ id: 'interaction-1' }]));
const mockDeleteInteraction = mock(() => Promise.resolve([{ id: 'interaction-1' }]));
const mockLogCRMActivity = mock(() => Promise.resolve(undefined));

mock.module('@/features/crm/interactions/server/repository', () => ({
  listInteractionsForOrganization: mockListInteractionsForOrganization,
  getInteractionById: mockGetInteractionById,
  createInteraction: mockCreateInteraction,
  updateInteraction: mockUpdateInteraction,
  deleteInteraction: mockDeleteInteraction,
}));

mock.module('@/features/crm/activity/server/service', () => ({
  logCRMActivity: mockLogCRMActivity,
}));

import * as service from '@/features/crm/interactions/server/service';

describe('interactions service', () => {
  beforeEach(() => {
    mockListInteractionsForOrganization.mockClear();
    mockGetInteractionById.mockClear();
    mockCreateInteraction.mockClear();
    mockUpdateInteraction.mockClear();
    mockDeleteInteraction.mockClear();
    mockLogCRMActivity.mockClear();
  });

  it('lists interactions with validated filters', async () => {
    await service.listInteractionsForOrganization('org-1', {
      type: 'note',
      limit: 20,
    });

    expect(mockListInteractionsForOrganization).toHaveBeenCalledWith('org-1', {
      type: 'note',
      limit: 20,
    });
  });

  it('creates an interaction and logs activity', async () => {
    const input = {
      type: 'call',
      subject: 'مكالمة متابعة',
      contactId: 'contact-1',
    } as const;

    await service.createNewInteraction('org-1', 'user-1', input);

    expect(mockCreateInteraction).toHaveBeenCalledWith('org-1', 'user-1', input);
    expect(mockLogCRMActivity).toHaveBeenCalledTimes(1);
  });

  it('updates an interaction and logs activity', async () => {
    await service.updateInteraction('interaction-1', 'user-1', {
      id: 'interaction-1',
      content: 'تم تحديث التفاعل',
    });

    expect(mockUpdateInteraction).toHaveBeenCalledWith('interaction-1', 'user-1', {
      id: 'interaction-1',
      content: 'تم تحديث التفاعل',
    });
    expect(mockLogCRMActivity).toHaveBeenCalledTimes(1);
  });

  it('deletes an interaction and logs activity', async () => {
    await service.deleteInteraction('org-1', 'user-1', 'interaction-1');

    expect(mockDeleteInteraction).toHaveBeenCalledWith('org-1', 'interaction-1');
    expect(mockLogCRMActivity).toHaveBeenCalledTimes(1);
  });
});
