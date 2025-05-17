'use client';

import { DashboardContent } from '@/components/dashboard';
import { UserPlus } from 'lucide-react';
import React, { useState } from 'react';
import { AddClientsDialog } from './dialog';
import AddGroup from '@/public/icons/iso/add-group.svg';
import { ClientsTable } from './components';

export default function ClientsPage() {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleEdit = (ids: string[]) => {
    // Implement bulk edit logic
    console.log('Editing:', ids);
  };

  const handleDelete = (ids: string[]) => {
    // Implement bulk delete logic
    console.log('Deleting:', ids);
  };

  const contacts = [
    {
      id: '1',
      name: 'شركة التقنية الحديثة',
      email: 'info@tech.com',
      phone: '+966501234567',
      city: 'الرياض',
      country: 'السعودية',
    },
    {
      id: '2',
      name: 'مؤسسة الحلول الذكية',
      email: 'contact@smart.com',
      phone: '+966555987654',
      city: 'جدة',
      country: 'السعودية',
    },
    {
      id: '3',
      name: 'نهج الابتكار',
      email: 'support@innovation.com',
      phone: '+971501234567',
      city: 'دبي',
      country: 'الإمارات',
    },
    {
      id: '4',
      name: 'نهج الابتكار',
      email: 'support@innovation-vercel.uk.app',
      phone: '+971501234567',
      city: 'دبي',
      country: 'الإمارات',
    },
  ];

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
        console.log('Sort by:', value);
      }}
      emptyState={{
        text: 'لايوجد عملاء بعد! أنشئ عميلك الأول للبدء.',
        icon: <AddGroup className="w-[100px] h-[100px]" />,
      }}
      dialogs={<AddClientsDialog isOpen={isDialogOpen} onClose={() => setDialogOpen(false)} />}
    >
      <ClientsTable contacts={contacts} onEdit={handleEdit} onDelete={handleDelete} />
    </DashboardContent>
  );
}
