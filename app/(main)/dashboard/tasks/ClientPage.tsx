'use client';

import { DashboardContent } from '@/components/dashboard';
import { TasksList } from './components/TasksList';
import { MultiplePagesPlus } from 'iconoir-react';
import { useState } from 'react';
import { TaskDialog } from './dialog';
import { TaskWithClient } from './types/tasks';
import AddCircle from '@/public/icons/iso/add-circle.svg';
import { log } from '@/utils/logs';
import { trpc } from '@/trpc/client';
import { Spinner } from '@/components/omel/Spinner';
import { toast } from 'react-hot-toast';

export default function TasksPage() {
  const { data: tasks = [], isPending, error } = trpc.crm.dashboard.task.getTasks.useQuery();
  const [isDialogOpen, setDialogOpen] = useState(false);
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
    console.log(
      log({
        component: 'TasksPage',
        message: 'Toggle task:' + 'ID [' + task.id + ']',
      })
    );
    updateTaskRpc.mutate({
      id: task.id,
      status: nextStatus,
    });
  };

  const handleTaskClick = (task: TaskWithClient) => {
    console.log(
      log({
        component: 'TasksPage',
        message: 'Clicked task:' + JSON.stringify(task),
      })
    );
  };

  const handleTaskDelete = (taskId: string) => {
    deleteTaskRpc.mutate({
      id: taskId,
    });
  };

  if (error) {
    console.error('Error fetching tasks:', error);
  }

  return (
    <DashboardContent
      title="المهام"
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
        console.log('Sort by:', value);
      }}
      emptyState={{
        text: 'لا توجد مهام بعد! أنشئ مهمتك الأولى للبدء.',
        icon: <AddCircle className="w-[100px] h-[100px]" />,
      }}
      dialogs={<TaskDialog isOpen={isDialogOpen} onClose={() => setDialogOpen(false)} />}
    >
      {isPending ? (
        <Spinner />
      ) : tasks.length > 0 ? (
        <TasksList
          tasks={tasks}
          onTaskToggle={handleTaskToggle}
          onTaskClick={handleTaskClick}
          onTaskDelete={handleTaskDelete}
        />
      ) : null}
    </DashboardContent>
  );
}
