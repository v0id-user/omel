'use client';

import { DashboardContent } from '@/components/dashboard';
import { TasksList } from './components/TasksList';
import { MultiplePagesPlus } from 'iconoir-react';
import { useState } from 'react';
import { TaskDialog } from './dialog';
import { Task } from '@/database/types/task';
import AddCircle from '@/public/icons/iso/add-circle.svg';
import { log } from '@/utils/logs';

// Extended type for display purposes (includes client name for UI)
type TaskWithClient = Task & {
  assignedToName?: string;
  clientName?: string;
};

// Placeholder data for tasks with varied due dates to showcase sections
const mockTasks: TaskWithClient[] = [
  {
    id: '1',
    description:
      'متابعة مع عميل الشركة الكبرى - مراجعة العقد وتحديد المتطلبات الجديدة للمشروع القادم',
    status: 'pending',
    priority: 'high',
    dueDate: new Date(), // Today
    assignedTo: 'user_1',
    assignedToName: 'أحمد محمد',
    clientName: 'شركة التقنية المتقدمة',
    category: null,
    createdBy: 'user_admin',
    updatedBy: 'user_admin',
    organizationId: 'org_1',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '2',
    description: 'إعداد تقرير المبيعات الشهري - تجميع بيانات المبيعات وإعداد التقرير التفصيلي',
    status: 'completed',
    priority: 'medium',
    dueDate: new Date('2024-01-12'),
    assignedTo: 'user_2',
    assignedToName: 'فاطمة أحمد',
    clientName: 'مؤسسة الابتكار',
    category: null,
    createdBy: 'user_admin',
    updatedBy: 'user_admin',
    organizationId: 'org_1',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: '3',
    description: 'اجتماع مع فريق التطوير - مناقشة التحديثات الجديدة ومراجعة الجدول الزمني',
    status: 'in_progress',
    priority: 'high',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
    assignedTo: 'user_3',
    assignedToName: 'عمر سالم',
    clientName: 'شركة المستقبل الرقمي',
    category: null,
    createdBy: 'user_admin',
    updatedBy: 'user_admin',
    organizationId: 'org_1',
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11'),
  },
  {
    id: '4',
    description: 'تحديث قاعدة بيانات العملاء - تنظيف وتحديث معلومات العملاء في النظام',
    status: 'pending',
    priority: 'low',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Overdue (2 days ago)
    assignedTo: 'user_4',
    assignedToName: 'سارة محمود',
    clientName: 'شركة الحلول الذكية',
    category: null,
    createdBy: 'user_admin',
    updatedBy: 'user_admin',
    organizationId: 'org_1',
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13'),
  },
  {
    id: '5',
    description: 'اختبار المهام - مهمة اختبار لليوم',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date(), // Today
    assignedTo: 'user_5',
    assignedToName: 'V0ID',
    clientName: 'عميل تجريبي',
    category: null,
    createdBy: 'user_admin',
    updatedBy: 'user_admin',
    organizationId: 'org_1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function TasksPage() {
  const tasks = mockTasks; // Replace with actual data later
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleTaskToggle = (taskId: string) => {
    // Placeholder for task toggle logic
    console.log(
      log({
        component: 'TasksPage',
        message: 'Toggle task:' + 'ID [' + taskId + ']',
      })
    );
  };

  const handleTaskClick = (task: TaskWithClient) => {
    // Placeholder for task click logic
    console.log(
      log({
        component: 'TasksPage',
        message: 'Clicked task:' + JSON.stringify(task),
      })
    );
  };

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
        // Placeholder for sort logic
        console.log('Sort by:', value);
      }}
      emptyState={{
        text: 'لا توجد مهام بعد! أنشئ مهمتك الأولى للبدء.',
        icon: <AddCircle className="w-[100px] h-[100px]" />,
      }}
      dialogs={<TaskDialog isOpen={isDialogOpen} onClose={() => setDialogOpen(false)} />}
    >
      {tasks.length > 0 ? (
        <TasksList tasks={tasks} onTaskToggle={handleTaskToggle} onTaskClick={handleTaskClick} />
      ) : null}
    </DashboardContent>
  );
}
