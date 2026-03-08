import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';

const invalidateMock = jest.fn();

jest.mock('@/lib/betterauth/auth-client', () => ({
  authClient: {
    useActiveOrganization: () => ({
      data: {
        members: [
          {
            id: 'member-1',
            userId: 'user-1',
            user: {
              name: 'أحمد خالد',
            },
          },
        ],
      },
    }),
  },
}));

jest.mock('@/store/persist/userInfo', () => ({
  useUserInfoStore: () => ({
    getUserInfo: () => ({
      userId: 'user-1',
    }),
  }),
}));

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('@/trpc/client', () => ({
  trpc: {
    useUtils: () => ({
      crm: {
        dashboard: {
          deal: {
            invalidate: invalidateMock,
          },
        },
      },
    }),
    crm: {
      dashboard: {
        contact: {
          getBulk: {
            useQuery: () => ({
              data: [],
            }),
          },
        },
        deal: {
          list: {
            useQuery: () => ({
              isPending: false,
              data: [
                {
                  id: 'deal-1',
                  title: 'اشتراك أساسي',
                  amount: '12000',
                  currency: 'SAR',
                  stage: 'lead',
                  status: 'open',
                  ownerId: 'user-1',
                  ownerName: 'أحمد خالد',
                  contactId: 'contact-1',
                  contactName: 'شركة الأفق',
                },
                {
                  id: 'deal-2',
                  title: 'توسعة المؤسسة',
                  amount: '50000',
                  currency: 'SAR',
                  stage: 'won',
                  status: 'won',
                  ownerId: 'user-1',
                  ownerName: 'أحمد خالد',
                  contactId: 'contact-2',
                  contactName: 'شركة المدار',
                },
              ],
            }),
          },
          summary: {
            useQuery: () => ({
              isPending: false,
              data: {
                total: 2,
                open: 1,
                won: 1,
                pipelineValue: 12000,
              },
            }),
          },
          new: {
            useMutation: () => ({
              mutate: jest.fn(),
              isPending: false,
            }),
          },
          update: {
            useMutation: () => ({
              mutate: jest.fn(),
              isPending: false,
            }),
          },
          delete: {
            useMutation: () => ({
              mutate: jest.fn(),
              isPending: false,
            }),
          },
        },
      },
    },
  },
}));

describe('DealsPage', () => {
  beforeEach(() => {
    invalidateMock.mockReset();
  });

  it('renders stage columns and deal metrics', () => {
    const { DealsPage } = require('@/features/crm/deals/ui/DealsPage');
    render(<DealsPage />);

    expect(screen.getByText('إجمالي الصفقات')).toBeTruthy();
    expect(screen.getByText('قيمة الخط المفتوح')).toBeTruthy();
    expect(screen.getAllByText('فرصة جديدة').length).toBeGreaterThan(0);
    expect(screen.getAllByText('مغلقة - فوز').length).toBeGreaterThan(0);
    expect(screen.getByText('اشتراك أساسي')).toBeTruthy();
    expect(screen.getByText('توسعة المؤسسة')).toBeTruthy();
  });
});
