'use client';

import { DashboardDialog } from '@/components/dashboard';
import { OButton } from '@/components/omel/Button';
import { trpc } from '@/trpc/client';
import toast from 'react-hot-toast';

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TaskDialog({ isOpen, onClose }: TaskDialogProps) {
  const utils = trpc.useUtils();
  const createTask = trpc.crm.dashboard.task.new.useMutation({
    onSuccess: () => {
      toast.success('تم إنشاء المهمة بنجاح');
      onClose();
      utils.invalidate();
    },
    onError: err => toast.error(err.message || 'حدث خطأ'),
  });

  return (
    <DashboardDialog isOpen={isOpen} title="مهمة جديدة" onClose={onClose} minimizable>
      <form
        onSubmit={e => {
          e.preventDefault();
          const form = e.currentTarget;
          const data = new FormData(form);
          createTask.mutate({
            name: data.get('name') as string,
            organizationId: 'org1',
            description: data.get('description') as string,
          });
        }}
        className="space-y-4"
      >
        <input
          required
          name="name"
          placeholder="اسم المهمة"
          className="w-full border p-2 rounded"
        />
        <textarea
          name="description"
          placeholder="وصف المهمة"
          className="w-full border p-2 rounded"
        />
        <OButton type="submit" isLoading={createTask.isPending}>
          إنشاء
        </OButton>
      </form>
    </DashboardDialog>
  );
}
