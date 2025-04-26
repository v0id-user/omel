'use client';

import { useState } from 'react';
import { DashboardDialog } from '@/components/dashboard';
import { OButton } from '@/components/omel/Button';
import { trpc } from '@/trpc/client';
import toast from 'react-hot-toast';
import { CheckCircle, Save } from 'lucide-react';
import { Calendar as CalendarIcon, AtSignCircle } from 'iconoir-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TaskDialog({ isOpen, onClose }: TaskDialogProps) {
  const utils = trpc.useUtils();
  const [dueDate, setDueDate] = useState<Date | null>(new Date());
  const [assignedUser, setAssignedUser] = useState<{ id: string; name: string } | null>(null);

  const createTask = trpc.crm.dashboard.task.new.useMutation({
    onSuccess: () => {
      toast.success('تم إنشاء المهمة بنجاح');
      onClose();
      utils.invalidate();
      // Reset form
      setDueDate(new Date());
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
      icon={<CheckCircle className="w-6 h-6" />}
    >
      <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
        {/* Task Body */}
        <textarea
          required
          name="description"
          placeholder="اكتب تفاصيل المهمة هنا..."
          className="w-full pt-4 px-4 text-sm focus:outline-none focus:ring-0 focus:border-primary resize-none min-h-[32px]"
        />

        {/* Bottom Controls & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-2 border-t border-gray-200 bg-gray-300/20">
          {/* Inline Due Date & Assignee */}
          <div className="flex items-center gap-6 text-sm text-gray-500">
            {/* Due Date */}
            <Popover>
              <PopoverTrigger
                asChild
                className="cursor-pointer py-1.5 px-2.5 rounded-md hover:bg-gray-200 transition-colors"
              >
                <label className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  اليوم
                </label>
              </PopoverTrigger>
              <PopoverContent
                className="bg-transparent border-0 p-0 w-fit z-[999]"
                align="end"
                side="bottom"
                sideOffset={10}
                sticky="always"
              >
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={(date: Date | Date[] | null) => {
                    setDueDate(date as Date | null);
                  }}
                  className="rounded-md border bg-white"
                />
              </PopoverContent>
            </Popover>

            {/* Assignee */}
            <Popover>
              <PopoverTrigger
                asChild
                className="cursor-pointer py-1.5 px-2.5 rounded-md hover:bg-gray-200 transition-colors"
              >
                <label className="flex items-center gap-2">
                  <AtSignCircle className="h-4 w-4" />
                  تعيين إلى
                </label>
              </PopoverTrigger>
              <PopoverContent
                className="bg-white p-3 w-fit z-[999]"
                align="end"
                side="bottom"
                sideOffset={10}
                avoidCollisions={false}
                sticky="always"
              >
                <div className="w-48">
                  <select
                    name="assignedTo"
                    className="w-full border p-2 rounded text-sm focus:outline-none"
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
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Save Button */}
          <OButton
            variant="secondary"
            type="submit"
            isLoading={createTask.isPending}
            className="flex items-center gap-1 px-4 text-sm"
          >
            حفظ
            <Save className="w-4 h-4" />
          </OButton>
        </div>
      </form>
    </DashboardDialog>
  );
}
