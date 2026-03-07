import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const invalidateMock = jest.fn();
const mutateMock = jest.fn();
const pushMock = jest.fn();
const contactsData: Array<{ id: string; name: string; email?: string }> = [];
const organizationData = {
  members: [
    {
      userId: 'user-1',
      user: { name: 'Current User', email: 'current@example.com' },
    },
    {
      userId: 'user-2',
      user: { name: 'Second User', email: 'second@example.com' },
    },
  ],
};

jest.mock('@/components/dashboard', () => ({
  DashboardDialog: ({
    isOpen,
    children,
  }: {
    isOpen: boolean;
    children: React.ReactNode;
  }) => (isOpen ? <div>{children}</div> : null),
}));

jest.mock('@/components/ui/popover', () => ({
  Popover: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PopoverTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PopoverContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@/components/ui/calendar', () => ({
  Calendar: () => <div>calendar</div>,
  formatGregorianDateArabic: () => 'اليوم',
}));

jest.mock('@/components/omel/Switch', () => ({
  Switch: ({ label }: { label: string }) => <div>{label}</div>,
}));

jest.mock('@/components/omel/Spinner', () => ({
  Spinner: () => <div>spinner</div>,
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

jest.mock('@/store/persist/userInfo', () => ({
  useUserInfoStore: () => ({
    getUserInfo: () => ({
      userId: 'user-1',
    }),
  }),
}));

jest.mock('@/lib/betterauth/auth-client', () => ({
  authClient: {
    useActiveOrganization: () => ({
      data: organizationData,
      isPending: false,
      error: null,
    }),
  },
}));

jest.mock('react-hot-toast', () => {
  const toast = jest.fn();
  (toast as unknown as { error: jest.Mock; success: jest.Mock }).error = jest.fn();
  (toast as unknown as { error: jest.Mock; success: jest.Mock }).success = jest.fn();
  return {
    __esModule: true,
    default: toast,
  };
});

jest.mock('@/trpc/client', () => ({
  trpc: {
    useUtils: () => ({
      invalidate: invalidateMock,
    }),
    crm: {
      dashboard: {
        contact: {
          getBulk: {
            useQuery: () => ({
              data: contactsData,
              isPending: false,
              error: null,
            }),
          },
          search: {
            useQuery: () => ({
              data: contactsData,
              isPending: false,
              error: null,
            }),
          },
        },
        task: {
          new: {
            useMutation: () => ({
              mutate: mutateMock,
              isPending: false,
            }),
          },
        },
      },
    },
  },
}));

describe('TaskDialog regressions', () => {
  beforeEach(() => {
    mutateMock.mockReset();
    invalidateMock.mockReset();
    pushMock.mockReset();
  });

  const renderDialog = () => {
    const { TaskDialog } = require('@/app/(main)/dashboard/tasks/dialog');
    render(<TaskDialog isOpen={true} onClose={jest.fn()} />);
  };

  const fillDescription = (value: string) => {
    const descriptionInput = screen.getByPlaceholderText('اكتب تفاصيل المهمة هنا...');
    fireEvent.change(descriptionInput, { target: { value } });
  };

  it('submits newly created task in same click', async () => {
    renderDialog();

    await waitFor(() => {
      expect(screen.getByText('معينة لك')).toBeTruthy();
    });

    fillDescription('New task description');
    fireEvent.click(screen.getByRole('button', { name: 'حفظ' }));

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalledTimes(1);
    });

    const firstCallArg = mutateMock.mock.calls[0][0] as Array<Record<string, unknown>>;
    expect(firstCallArg).toHaveLength(1);
    expect(firstCallArg[0]).toMatchObject({
      description: 'New task description',
      assignedTo: 'user-1',
    });
  });

  it('does not submit when selecting assignee row', async () => {
    renderDialog();

    await waitFor(() => {
      expect(screen.getByText('معينة لك')).toBeTruthy();
    });

    fillDescription('Select assignee test');
    fireEvent.click(screen.getByRole('button', { name: /Second User/i }));

    await waitFor(() => {
      expect(mutateMock).not.toHaveBeenCalled();
    });
  });

  it('returns to default assignee when clicking the same user again', async () => {
    renderDialog();

    await waitFor(() => {
      expect(screen.getByText('معينة لك')).toBeTruthy();
    });

    fireEvent.click(screen.getByRole('button', { name: /Second User/i }));
    fireEvent.click(screen.getByRole('button', { name: /Second User/i }));

    await waitFor(() => {
      expect(screen.getByText('معينة لك')).toBeTruthy();
    });
  });
});
