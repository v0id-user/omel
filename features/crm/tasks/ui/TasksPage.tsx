'use client';

import { DashboardContent } from '@/components/dashboard';
import { TasksList } from '@/app/(main)/dashboard/tasks/components/TasksList';
import { MultiplePagesPlus } from 'iconoir-react';
import { useEffect, useMemo, useState } from 'react';
import { TaskDialog } from '@/app/(main)/dashboard/tasks/dialog';
import AddCircle from '@/public/icons/iso/add-circle.svg';
import { trpc } from '@/trpc/client';
import { Spinner } from '@/components/omel/Spinner';
import { toast } from 'react-hot-toast';
import { TaskWithClient } from '../types';
import { DashboardDialog } from '@/components/dashboard/Dialog';
import { OButton } from '@/components/omel/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TASK_PRIORITIES, TASK_STATUSES, TaskPriority, TaskStatus } from '@/database/types/task';
import { authClient } from '@/lib/betterauth/auth-client';

const taskStatusLabels: Record<string, string> = {
  pending: 'قيد الانتظار',
  in_progress: 'قيد التنفيذ',
  completed: 'مكتملة',
  blocked: 'متوقفة',
  cancelled: 'ملغاة',
};

const taskPriorityLabels: Record<string, string> = {
  low: 'منخفضة',
  medium: 'متوسطة',
  high: 'مرتفعة',
  urgent: 'عاجلة',
};

function TaskEditDialog({
  isOpen,
  onClose,
  task,
}: {
  isOpen: boolean;
  onClose: () => void;
  task: TaskWithClient | null;
}) {
  const utils = trpc.useUtils();
  const contactsQuery = trpc.crm.dashboard.contact.getBulk.useQuery(
    { limit: 100 },
    { enabled: isOpen }
  );
  const { data: organization } = authClient.useActiveOrganization();
  const members = organization?.members ?? [];

  const updateTask = trpc.crm.dashboard.task.update.useMutation({
    onSuccess: async () => {
      await utils.crm.dashboard.task.getTasks.invalidate();
      toast.success('تم تحديث المهمة');
      onClose();
    },
    onError: error => {
      toast.error(error.message || 'تعذر تحديث المهمة');
    },
  });

  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [priority, setPriority] = useState<TaskPriority>('low');
  const [relatedTo, setRelatedTo] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (!task) {
      return;
    }

    setDescription(task.description || '');
    setStatus(task.status);
    setPriority(task.priority);
    setRelatedTo(task.relatedTo || '');
    setAssignedTo(task.assignedTo || '');
    setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : '');
  }, [task]);

  if (!task) {
    return null;
  }

  return (
    <DashboardDialog isOpen={isOpen} onClose={onClose} title="تحديث المهمة">
      <div className="space-y-4 p-5" dir="rtl">
        <div className="space-y-2">
          <label className="text-sm font-medium">الوصف</label>
          <Textarea value={description} onChange={event => setDescription(event.target.value)} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">الحالة</label>
            <select
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              value={status}
              onChange={event => setStatus(event.target.value as TaskStatus)}
            >
              {TASK_STATUSES.map(value => (
                <option key={value} value={value}>
                  {taskStatusLabels[value]}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">الأولوية</label>
            <select
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              value={priority}
              onChange={event => setPriority(event.target.value as TaskPriority)}
            >
              {TASK_PRIORITIES.map(value => (
                <option key={value} value={value}>
                  {taskPriorityLabels[value]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">العميل المرتبط</label>
            <select
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              value={relatedTo}
              onChange={event => setRelatedTo(event.target.value)}
            >
              <option value="">بدون عميل</option>
              {(contactsQuery.data ?? []).map(contact => (
                <option key={contact.id} value={contact.id}>
                  {contact.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">المُعيّن إليه</label>
            <select
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              value={assignedTo}
              onChange={event => setAssignedTo(event.target.value)}
            >
              {members.map(member => (
                <option key={member.userId} value={member.userId}>
                  {member.user.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">تاريخ الاستحقاق</label>
          <Input type="date" value={dueDate} onChange={event => setDueDate(event.target.value)} />
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <OButton variant="ghost" onClick={onClose}>
            إلغاء
          </OButton>
          <OButton
            onClick={() =>
              updateTask.mutate({
                id: task.id,
                description,
                status,
                priority,
                relatedTo: relatedTo || null,
                assignedTo,
                dueDate: dueDate ? new Date(dueDate) : null,
              })
            }
            isLoading={updateTask.isPending}
          >
            حفظ التعديلات
          </OButton>
        </div>
      </div>
    </DashboardDialog>
  );
}

export default function TasksPage() {
  const { data: tasks = [], isPending, error } = trpc.crm.dashboard.task.getTasks.useQuery();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskWithClient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | ''>('');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'status'>('dueDate');
  const utils = trpc.useUtils();
  const updateTaskRpc = trpc.crm.dashboard.task.update.useMutation({
    onSuccess: () => {
      utils.crm.dashboard.task.getTasks.invalidate();
    },
    onError: error => {
      toast.error(error.message || 'حدث خطأ أثناء تحديث المهمة');
    },
  });

  const deleteTaskRpc = trpc.crm.dashboard.task.delete.useMutation({
    onSuccess: () => {
      toast.success('تم حذف المهمة');
      utils.crm.dashboard.task.getTasks.invalidate();
    },
    onError: error => {
      toast.error(error.message || 'حدث خطأ أثناء حذف المهمة');
    },
  });

  const handleTaskToggle = (task: TaskWithClient) => {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    updateTaskRpc.mutate({
      id: task.id,
      status: nextStatus,
    });
  };

  const handleTaskClick = (task: TaskWithClient) => {
    setSelectedTask(task);
    setEditDialogOpen(true);
  };

  const handleTaskDelete = (taskId: string) => {
    deleteTaskRpc.mutate({
      id: taskId,
    });
  };

  if (error) {
    console.error('Error fetching tasks:', error);
  }

  const filteredTasks = useMemo(() => {
    const searchValue = searchTerm.trim().toLowerCase();

    return [...tasks]
      .filter(task => {
        if (statusFilter && task.status !== statusFilter) {
          return false;
        }

        if (priorityFilter && task.priority !== priorityFilter) {
          return false;
        }

        if (!searchValue) {
          return true;
        }

        return [task.description, task.clientName, task.assignedToName]
          .filter(Boolean)
          .some(value => String(value).toLowerCase().includes(searchValue));
      })
      .sort((left, right) => {
        if (sortBy === 'dueDate') {
          return new Date(left.dueDate ?? 0).getTime() - new Date(right.dueDate ?? 0).getTime();
        }

        if (sortBy === 'priority') {
          const priorityRank: Record<TaskPriority, number> = {
            low: 0,
            medium: 1,
            high: 2,
            urgent: 3,
          };

          return priorityRank[right.priority] - priorityRank[left.priority];
        }

        return left.status.localeCompare(right.status, 'ar');
      });
  }, [priorityFilter, searchTerm, sortBy, statusFilter, tasks]);

  return (
    <DashboardContent
      title="المهام"
      ctaLabel="مهمة جديدة"
      ctaIcon={<MultiplePagesPlus className="w-4 h-4 ml-2" />}
      onCtaClick={() => setDialogOpen(true)}
      emptyState={{
        text: 'لا توجد مهام بعد! أنشئ مهمتك الأولى للبدء.',
        icon: <AddCircle className="w-[100px] h-[100px]" />,
      }}
      dialogs={
        <>
          <TaskDialog isOpen={isDialogOpen} onClose={() => setDialogOpen(false)} />
          <TaskEditDialog
            isOpen={isEditDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            task={selectedTask}
          />
        </>
      }
    >
      {isPending ? (
        <Spinner />
      ) : tasks.length > 0 ? (
        <div className="space-y-4 px-4 py-5" dir="rtl">
          <div className="grid gap-3 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-4">
            <Input
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
              placeholder="ابحث في المهام أو العملاء أو الأعضاء"
            />
            <select
              className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              value={statusFilter}
              onChange={event => setStatusFilter(event.target.value as TaskStatus | '')}
            >
              <option value="">كل الحالات</option>
              {TASK_STATUSES.map(status => (
                <option key={status} value={status}>
                  {taskStatusLabels[status]}
                </option>
              ))}
            </select>
            <select
              className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              value={priorityFilter}
              onChange={event => setPriorityFilter(event.target.value as TaskPriority | '')}
            >
              <option value="">كل الأولويات</option>
              {TASK_PRIORITIES.map(priority => (
                <option key={priority} value={priority}>
                  {taskPriorityLabels[priority]}
                </option>
              ))}
            </select>
            <select
              className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              value={sortBy}
              onChange={event => setSortBy(event.target.value as 'dueDate' | 'priority' | 'status')}
            >
              <option value="dueDate">ترتيب حسب تاريخ الاستحقاق</option>
              <option value="priority">ترتيب حسب الأولوية</option>
              <option value="status">ترتيب حسب الحالة</option>
            </select>
          </div>

          <TasksList
            tasks={filteredTasks}
            onTaskToggle={handleTaskToggle}
            onTaskClick={handleTaskClick}
            onTaskDelete={handleTaskDelete}
          />
        </div>
      ) : null}
    </DashboardContent>
  );
}
