'use client';

import { DashboardContent } from '@/components/dashboard';
import { UserPlus } from 'iconoir-react';
import { useState } from 'react';
import { AddClientsDialog } from './dialog';
import AddGroup from '@/public/icons/iso/add-group.svg';
import { Table } from '@/components/ui/table';

export default function ClientsPage() {
  const [isDialogOpen, setDialogOpen] = useState(false);

  return (
    <DashboardContent
      title="العملاء"
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
        icon: <AddGroup className="w-[100px] h-[100px]" />,
      }}
      dialogs={<AddClientsDialog isOpen={isDialogOpen} onClose={() => setDialogOpen(false)} />}
    >
      <Table>{/* TODO */}</Table>
    </DashboardContent>
  );
}
