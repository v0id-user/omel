'use client';

import { useState } from 'react';
import { DashboardDialog } from '@/components/dashboard';
import { OButton } from '@/components/omel/Button';
import { trpc } from '@/trpc/client';
import toast from 'react-hot-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, User, CheckCircle } from 'lucide-react';
import { formatGregorianDateArabic } from '@/components/ui/calendar';

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TaskDialog({ isOpen, onClose }: TaskDialogProps) {
  const utils = trpc.useUtils();
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [taskName, setTaskName] = useState('');
  const [assignedUser, setAssignedUser] = useState<{ id: string; name: string } | null>(null);

  const createTask = trpc.crm.dashboard.task.new.useMutation({
    onSuccess: () => {
      toast.success('تم إنشاء المهمة بنجاح');
      onClose();
      utils.invalidate();
      // Reset form
      setTaskName('');
      setDueDate(null);
      setAssignedUser(null);
    },
    onError: err => toast.error(err.message || 'حدث خطأ'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);

    createTask.mutate({
      name: data.get('name') as string,
      description: data.get('description') as string,
      organizationId: 'org1',
      ...(dueDate && { dueDate: dueDate }),
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
        {/* Task Title Input */}
        <div className="relative">
          <input
            required
            name="name"
            value={taskName}
            onChange={e => setTaskName(e.target.value)}
            placeholder="اكتب عنوان المهمة هنا"
            className="w-full border-0 border-b border-gray-200 p-2 pb-3 text-lg font-medium focus:outline-none focus:ring-0 focus:border-primary"
          />
        </div>

        {/* Horizontal Options */}
        <div className="flex items-center gap-2 py-2 border-b border-gray-200">
          {/* Date Picker */}
          <Popover>
            <PopoverTrigger className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-md hover:bg-gray-100">
              <CalendarIcon className="h-4 w-4" />
              <span>{dueDate ? formatGregorianDateArabic(dueDate) : 'تاريخ الاستحقاق'}</span>
            </PopoverTrigger>
            <PopoverContent className="p-0 z-[70]" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={date => setDueDate(date as Date | null)}
                className="border rounded-md"
              />
            </PopoverContent>
          </Popover>

          {/* Assigned To */}
          <Popover>
            <PopoverTrigger className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-md hover:bg-gray-100">
              <User className="h-4 w-4" />
              {assignedUser ? (
                <span>
                  <span className="text-gray-500">تعيين إلى:</span>{' '}
                  <span className="text-primary font-medium">{assignedUser.name}</span>
                </span>
              ) : (
                <span>تعيين إلى</span>
              )}
            </PopoverTrigger>
            <PopoverContent className="p-2 z-[70]" align="start">
              <div className="space-y-2">
                <label className="text-sm font-medium">تعيين المهمة إلى:</label>
                <select
                  name="assignedTo"
                  className="w-full border p-2 rounded"
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
                  <option value="">اختر المستخدم</option>
                  <option value="user1">أحمد محمد</option>
                  <option value="user2">سارة علي</option>
                  <option value="user3">محمد خالد</option>
                </select>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Description */}
        <textarea
          name="description"
          placeholder="وصف المهمة"
          className="w-full border p-2 rounded h-24 text-sm resize-none"
        />

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Add additional action buttons here if needed */}
          </div>

          <div className="flex items-center">
            <OButton
              type="submit"
              isLoading={createTask.isPending}
              className="flex items-center gap-1 px-4"
            >
              حفظ
            </OButton>
          </div>
        </div>
      </form>
    </DashboardDialog>
  );
}
