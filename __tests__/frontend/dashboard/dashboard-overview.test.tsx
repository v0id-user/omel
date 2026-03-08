import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';

jest.mock('@/trpc/client', () => ({
  trpc: {
    crm: {
      dashboard: {
        contact: {
          getByPage: {
            useQuery: () => ({
              isPending: false,
              data: {
                data: [
                  {
                    id: 'contact-1',
                    name: 'شركة الأفق',
                    email: 'team@horizon.sa',
                    createdAt: new Date('2026-03-01'),
                  },
                ],
                total: 12,
              },
            }),
          },
        },
        task: {
          getTasks: {
            useQuery: () => ({
              isPending: false,
              data: [
                {
                  id: 'task-1',
                  description: 'متابعة العرض',
                  status: 'pending',
                  clientName: 'شركة الأفق',
                  assignedToName: 'أحمد',
                  dueDate: new Date('2026-03-12'),
                },
                {
                  id: 'task-2',
                  description: 'إرسال العقد',
                  status: 'completed',
                  clientName: 'شركة الأفق',
                  assignedToName: 'سارة',
                  dueDate: new Date('2026-03-09'),
                },
              ],
            }),
          },
        },
        deal: {
          summary: {
            useQuery: () => ({
              isPending: false,
              data: {
                open: 4,
                won: 2,
                pipelineValue: 180000,
              },
            }),
          },
        },
        interaction: {
          list: {
            useQuery: () => ({
              isPending: false,
              data: [
                {
                  id: 'interaction-1',
                  subject: 'اجتماع اكتشاف',
                  contactName: 'شركة الأفق',
                  dealTitle: 'اشتراك سنوي',
                  occurredAt: new Date('2026-03-08'),
                },
              ],
            }),
          },
        },
      },
    },
  },
}));

describe('Dashboard overview page', () => {
  it('renders CRM metrics and recent activity sections', () => {
    const DashboardPage = require('@/app/(main)/dashboard/page').default;
    render(<DashboardPage />);

    expect(screen.getByText('الصفقات المفتوحة')).toBeTruthy();
    expect(screen.getByText('الصفقات المغلقة فوز')).toBeTruthy();
    expect(screen.getByText('آخر الأنشطة')).toBeTruthy();
    expect(screen.getByText('اجتماع اكتشاف')).toBeTruthy();
    expect(screen.getByText('مؤشر النمو التجاري')).toBeTruthy();
  });
});
