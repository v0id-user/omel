import { beforeEach, describe, expect, it, mock } from 'bun:test';

const mockGetDealsForOrganization = mock(() => Promise.resolve([]));
const mockGetDealById = mock(() => Promise.resolve(null));
const mockGetDealsByContactId = mock(() => Promise.resolve([]));
const mockCreateDeal = mock(() => Promise.resolve([{ id: 'deal-1' }]));
const mockUpdateDeal = mock(() => Promise.resolve([{ id: 'deal-1' }]));
const mockDeleteDeal = mock(() => Promise.resolve([{ id: 'deal-1' }]));
const mockGetDealSummary = mock(() =>
  Promise.resolve({
    total: 1,
    open: 1,
    won: 0,
    lost: 0,
    pipelineValue: 1000,
    wonValue: 0,
    byStage: [],
  })
);
const mockLogCRMActivity = mock(() => Promise.resolve(undefined));

mock.module('@/features/crm/deals/server/repository', () => ({
  getDealsForOrganization: mockGetDealsForOrganization,
  getDealById: mockGetDealById,
  getDealsByContactId: mockGetDealsByContactId,
  createDeal: mockCreateDeal,
  updateDeal: mockUpdateDeal,
  deleteDeal: mockDeleteDeal,
  getDealSummary: mockGetDealSummary,
}));

mock.module('@/features/crm/activity/server/service', () => ({
  logCRMActivity: mockLogCRMActivity,
}));

import * as service from '@/features/crm/deals/server/service';

describe('deals service', () => {
  beforeEach(() => {
    mockGetDealsForOrganization.mockClear();
    mockGetDealById.mockClear();
    mockGetDealsByContactId.mockClear();
    mockCreateDeal.mockClear();
    mockUpdateDeal.mockClear();
    mockDeleteDeal.mockClear();
    mockGetDealSummary.mockClear();
    mockLogCRMActivity.mockClear();
  });

  it('lists deals with validated filters', async () => {
    await service.listDealsForOrganization('org-1', {
      status: 'open',
      limit: 25,
    });

    expect(mockGetDealsForOrganization).toHaveBeenCalledWith('org-1', {
      status: 'open',
      limit: 25,
    });
  });

  it('creates a deal and logs activity', async () => {
    const input = {
      title: 'صفقة جديدة',
      amount: '15000',
      currency: 'SAR',
      ownerId: 'user-1',
    } as const;

    await service.createNewDeal('org-1', 'user-1', input);

    expect(mockCreateDeal).toHaveBeenCalledWith('org-1', 'user-1', input);
    expect(mockLogCRMActivity).toHaveBeenCalledTimes(1);
  });

  it('updates a deal and logs activity', async () => {
    await service.updateDeal('deal-1', 'user-1', {
      id: 'deal-1',
      stage: 'won',
    });

    expect(mockUpdateDeal).toHaveBeenCalledWith('deal-1', 'user-1', {
      id: 'deal-1',
      stage: 'won',
    });
    expect(mockLogCRMActivity).toHaveBeenCalledTimes(1);
  });

  it('deletes a deal and logs activity', async () => {
    await service.deleteDeal('org-1', 'user-1', 'deal-1');

    expect(mockDeleteDeal).toHaveBeenCalledWith('org-1', 'deal-1');
    expect(mockLogCRMActivity).toHaveBeenCalledTimes(1);
  });

  it('returns deal summary', async () => {
    await service.getDealSummary('org-1');
    expect(mockGetDealSummary).toHaveBeenCalledWith('org-1');
  });
});
