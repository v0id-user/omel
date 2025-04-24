'use client';

import { DashboardContent, DashboardDialog } from '@/components/dashboard';
import { MultiplePagesPlus } from 'iconoir-react';
import { useState } from 'react';
import { trpc } from '@/trpc/client';
import toast from 'react-hot-toast';
import { OButton } from '@/components/omel/Button';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
}

export default function TasksPage() {
  // Placeholder for future task management logic
  const tasks: Task[] = [];
  const [isDialogOpen, setDialogOpen] = useState(false);
  const utils = trpc.useUtils();
  const createTask = trpc.crm.dashboard.task.new.useMutation({
    onSuccess: () => {
      toast.success('تم إنشاء المهمة بنجاح');
      setDialogOpen(false);
      utils.invalidate();
    },
    onError: err => toast.error(err.message || 'حدث خطأ'),
  });

  return (
    <DashboardContent
      title="المهام"
      emptyStateIcon="/icons/iso/add-circle.svg"
      ctaLabel="مهمة جديدة"
      ctaIcon={<MultiplePagesPlus className="w-4 h-4 ml-2" />}
      onCtaClick={() => setDialogOpen(true)}
      sortOptions={[
        { value: 'dueDate', label: 'تاريخ الانتهاء' },
        { value: 'priority', label: 'الأولوية' },
        { value: 'status', label: 'الحالة' },
      ]}
      currentSort="dueDate"
      onSortChange={value => {
        // Placeholder for sort logic
        console.log('Sort by:', value);
      }}
      emptyState={{
        text: 'لا توجد مهام بعد! أنشئ مهمتك الأولى للبدء.',
      }}
      dialogs={
        <DashboardDialog
          isOpen={isDialogOpen}
          title="مهمة جديدة"
          onClose={() => setDialogOpen(false)}
          minimizable
        >
          {/* simple form */}
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
      }
    >
      {tasks.length > 0 ? (
        <div className="space-y-4">
          {/* Placeholder for task list */}
          {tasks.map(task => (
            <div key={task.id}>Task item placeholder</div>
          ))}
        </div>
      ) : null}
    </DashboardContent>
  );
}
