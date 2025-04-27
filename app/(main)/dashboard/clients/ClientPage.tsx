'use client';

import { DashboardContent } from '@/components/dashboard';
import { UserPlus } from 'iconoir-react';
import { useState } from 'react';
import { AddClientsDialog } from './dialog';
import { Task } from '@/database/types/task';

export default function ClientsPage() {
  // Placeholder for future task management logic
  const tasks: Task[] = [];
  const [isDialogOpen, setDialogOpen] = useState(false);

  return (
    <DashboardContent
      title="العملاء"
      emptyStateIcon="/icons/iso/add-group.svg"
      ctaLabel="عميل جديد"
      ctaIcon={<UserPlus className="w-4 h-4 ml-2" />}
      onCtaClick={() => setDialogOpen(true)}
      sortOptions={[
        { value: 'name', label: 'الاسم' },
        { value: 'email', label: 'البريد الإلكتروني' },
        { value: 'phone', label: 'الهاتف' },
      ]}
      currentSort="name"
      onSortChange={value => {
        // Placeholder for sort logic
        console.log('Sort by:', value);
      }}
      emptyState={{
        text: 'لايوجد عملاء بعد! أنشئ عميلك الأول للبدء.',
      }}
      dialogs={<AddClientsDialog isOpen={isDialogOpen} onClose={() => setDialogOpen(false)} />}
    >
      {tasks.length > 0 ? (
        <div className="space-y-4">
          {/* Placeholder for contact list */}
          {tasks.map(task => (
            // Make cards
            <div key={task.id}>Task item placeholder</div>
          ))}
        </div>
      ) : null}
    </DashboardContent>
  );
}
