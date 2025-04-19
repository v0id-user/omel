'use client';

import { DashboardContent } from '@/components/dashboard';
import { MultiplePagesPlus } from 'iconoir-react';

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

  return (
    <DashboardContent
      title="المهام"
      ctaLabel="مهمة جديدة"
      ctaIcon={<MultiplePagesPlus className="w-4 h-4 ml-2" />}
      onCtaClick={() => {
        // Placeholder for task creation logic
        console.log('Create new task');
      }}
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
