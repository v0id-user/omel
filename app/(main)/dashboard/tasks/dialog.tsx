'use client';

import { useState } from 'react';
import { DashboardDialog } from '@/components/dashboard';
import { OButton } from '@/components/omel/Button';
import { trpc } from '@/trpc/client';
import toast from 'react-hot-toast';
import { Calendar as CalendarIcon, AtSignCircle, MultiplePagesPlus } from 'iconoir-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar, formatGregorianDateArabic } from '@/components/ui/calendar';
import { Switch } from '@/components/omel/Switch';
import { CreateTaskInput } from '@/database/types/task';
import { useUserInfoStore } from '@/store/persist/userInfo';
import { useRouter } from 'next/navigation';

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TaskDialog({ isOpen, onClose }: TaskDialogProps) {
  const utils = trpc.useUtils();
  const [dueDate, setDueDate] = useState<Date | null>(new Date());
  const [assignedUser, setAssignedUser] = useState<{ id: string; name: string } | null>(null);
  const [moreTasks, setMoreTasks] = useState<boolean>(false);
  const [tasks, setTasks] = useState<CreateTaskInput[]>([]);
  const userInfo = useUserInfoStore();
  const router = useRouter();

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

  const appendTask = (task: CreateTaskInput) => {
    setTasks(prev => [...prev, task]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);

    const description = (data.get('description') as string) ?? '';

    const user = userInfo.getUserInfo();

    if (!user) {
      toast.error('حدث خطأ');
      router.push('/clock-in');
      return;
    }

    const task: CreateTaskInput = {
      name: description.slice(0, 100) || 'مهمة جديدة',
      description,
      dueDate: dueDate || null,
      assignedTo: assignedUser?.id || '',
      status: 'pending',
      category: null,
      priority: 'low',
    };

    appendTask(task);
    if (!moreTasks) {
      createTask.mutate(tasks);
    }
  };

  return (
    <DashboardDialog
      isOpen={isOpen}
      title="مهمة جديدة"
      onClose={onClose}
      icon={<MultiplePagesPlus className="w-4 h-4" />}
    >
      <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
        {/* Task Body */}
        <textarea
          required
          name="description"
          placeholder="اكتب تفاصيل المهمة هنا..."
          className="w-full pt-4 px-4 text-sm font-medium focus:outline-none focus:ring-0 focus:border-primary resize-none min-h-[32px]"
        />

        {/* Bottom Controls & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-2 border-t border-gray-200 bg-gray-300/10">
          {/* Inline Due Date & Assignee */}
          <div className="flex items-center gap-6 text-sm text-gray-500 font-medium">
            {/* Due Date */}
            <Popover>
              <PopoverTrigger
                asChild
                className="cursor-pointer py-1.5 px-2.5 rounded-md hover:bg-gray-200 transition-colors"
              >
                <label className="flex items-center gap-2 font-medium">
                  <CalendarIcon className="h-4 w-4" />
                  {dueDate ? formatGregorianDateArabic(dueDate) : 'اليوم'}
                </label>
              </PopoverTrigger>
              <PopoverContent
                className="bg-transparent border-0 p-0 w-fit z-[999]"
                align="end"
                side="bottom"
                sideOffset={7}
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
                <label className="flex items-center gap-2 font-medium">
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
                    className="w-full border p-2 rounded text-sm focus:outline-none font-medium"
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
          <div className="flex items-center gap-4">
            {/* Add more */}
            <Switch
              checked={moreTasks}
              onChange={() => setMoreTasks(!moreTasks)}
              label="اصنع المزيد"
              labelClassName="text-sm text-gray-500 font-medium"
            />

            {/* Cancel Button */}
            <OButton
              variant="ghost"
              type="submit"
              isLoading={createTask.isPending}
              className="flex items-center gap-2 px-2 font-medium text-sm"
            >
              الغاء
              <kbd className="px-2 py-1 text-[11px] font-light text-gray-800 bg-transparent border border-gray-200 rounded-lg min-w-[24px] h-6 flex items-center justify-center">
                Esc
              </kbd>
            </OButton>

            {/* Save Button */}
            <OButton
              variant="secondary"
              type="submit"
              isLoading={createTask.isPending}
              className="flex items-center gap-2 px-4 font-medium text-sm"
            >
              حفظ
              <svg
                className="ring-1 ring-gray-300 rounded-sm p-[2px]"
                width="16"
                height="16"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.50419 7.75419C2.33336 7.92502 2.33336 8.20204 2.50419 8.37289L5.42086 11.2895C5.59169 11.4604 5.8687 11.4604 6.03954 11.2895C6.21037 11.1187 6.21037 10.8417 6.03954 10.6708L3.82913 8.46044H9.33336C10.6219 8.46044 11.6667 7.41577 11.6667 6.12711V2.91878C11.6667 2.67716 11.4708 2.48128 11.2292 2.48128C10.9875 2.48128 10.7917 2.67716 10.7917 2.91878V6.12711C10.7917 6.93498 10.1412 7.58544 9.33336 7.58544H3.82913L6.03954 5.37504C6.21037 5.20421 6.21037 4.9272 6.03954 4.75637C5.8687 4.58553 5.59169 4.58553 5.42086 4.75637L2.50419 7.67303C2.50419 7.67303 2.50419 7.75419 2.50419 7.75419Z"
                  fill="currentColor"
                />
              </svg>
            </OButton>
          </div>
        </div>
      </form>
    </DashboardDialog>
  );
}
