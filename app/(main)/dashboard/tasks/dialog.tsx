'use client';

import { useState } from 'react';
import { DashboardDialog } from '@/components/dashboard';
import { OButton } from '@/components/omel/Button';
import { trpc } from '@/trpc/client';
import toast from 'react-hot-toast';
import { Calendar as CalendarIcon, User, CheckCircle, Save } from 'lucide-react';

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TaskDialog({ isOpen, onClose }: TaskDialogProps) {
  const utils = trpc.useUtils();
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [assignedUser, setAssignedUser] = useState<{ id: string; name: string } | null>(null);

  const createTask = trpc.crm.dashboard.task.new.useMutation({
    onSuccess: () => {
      toast.success('تم إنشاء المهمة بنجاح');
      onClose();
      utils.invalidate();
      // Reset form
      setDueDate(null);
      setAssignedUser(null);
    },
    onError: err => toast.error(err.message || 'حدث خطأ'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);

    const description = (data.get('description') as string) ?? '';

    createTask.mutate({
      name: description.slice(0, 100) || 'مهمة جديدة',
      description,
      organizationId: 'org1',
      ...(dueDate && { dueDate }),
      ...(assignedUser?.id && { assignedTo: assignedUser.id }),
    });
  };

  return (
    <DashboardDialog
      isOpen={isOpen}
      title="مهمة جديدة"
      onClose={onClose}
      minimizable
      icon={<CheckCircle className="w-6 h-6" />}
    >
      <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
        {/* Task Body */}
        <textarea
          required
          name="description"
          placeholder="اكتب تفاصيل المهمة هنا..."
          className="w-full p-2 pb-3 text-lg font-medium focus:outline-none focus:ring-0 focus:border-primary resize-none min-h-[64px]"
        />

        {/* Bottom Controls & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-2 border-t border-gray-200 bg-gray-300/20">
          {/* Inline Due Date & Assignee */}
          <div className="flex items-center gap-6 text-sm">
            {/* Due Date */}
            <label className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <input
                type="date"
                value={dueDate ? new Date(dueDate).toISOString().split('T')[0] : ''}
                onChange={e => {
                  const value = e.target.value;
                  setDueDate(value ? new Date(value) : null);
                }}
                className="border p-1 rounded text-sm focus:outline-none"
              />
            </label>

            {/* Assignee */}
            <label className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <select
                name="assignedTo"
                className="border p-1 rounded text-sm focus:outline-none"
                value={assignedUser?.id || ''}
                onChange={e => {
                  const selectedId = e.target.value;
                  if (!selectedId) {
                    setAssignedUser(null);
                    return;
                  }

                  const options = [
                    { id: 'user1', name: 'أحمد محمد' },
                    { id: 'user2', name: 'سارة علي' },
                    { id: 'user3', name: 'محمد خالد' },
                  ];

                  const selected = options.find(user => user.id === selectedId);
                  if (selected) {
                    setAssignedUser(selected);
                  }
                }}
              >
                <option value="">تعيين إلى</option>
                <option value="user1">أحمد محمد</option>
                <option value="user2">سارة علي</option>
                <option value="user3">محمد خالد</option>
              </select>
            </label>
          </div>

          {/* Save Button */}
          <OButton
            variant="secondary"
            type="submit"
            isLoading={createTask.isPending}
            className="flex items-center gap-1 px-4"
          >
            حفظ
            <Save className="w-4 h-4" />
          </OButton>
        </div>
      </form>
    </DashboardDialog>
  );
}
