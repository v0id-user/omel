'use client';

import { DashboardContent } from '@/components/dashboard';
import { UserPlus } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { AddClientsDialog } from './dialog';
import AddGroup from '@/public/icons/iso/add-group.svg';
import { ClientsTable } from './components';
import { trpc } from '@/trpc/client';
import { Spinner } from '@/components/omel/Spinner';
import { toast } from 'react-hot-toast';

export default function ClientsPage() {
  const [isDialogOpen, setDialogOpen] = useState(false);
  // TODO: it's over, use them BABYYYY ALL
  const { data: pages } = trpc.crm.dashboard.contact.pages.useQuery({
    length: 10,
  });
  const {
    data: clients,
    error: clientsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  } = trpc.crm.dashboard.contact.get.useInfiniteQuery(
    {
      cursor: null,
    },
    {
      getNextPageParam: lastPage => lastPage.nextCursor,
      retry: (failureCount, error) => {
        // Retry only if NOT a 404 / NOT end of pagination
        return error?.data?.code !== 'NOT_FOUND' && failureCount < 3;
      },
    }
  );

  // Handle error toast in useEffect
  useEffect(() => {
    if (clientsError && clientsError.data?.code !== 'NOT_FOUND') {
      toast.error(clientsError.message);
    }
  }, [clientsError]);

  // const handleEdit = (ids: string[]) => {
  //   // TODO: Just make a trpc endpoint that accept array, if it's one or multiable does the same thing
  //   // TODO: prompt mutliable dialogs for edits and save them to edtiable, then perform the edit on trpc
  //   // TODO: Just don't do it like that for know even hide the edit button but keep the logic for later
  //   // Implement bulk edit logic
  //   console.log('Editing:', ids);
  // };

  const handleDelete = (ids: string[]) => {
    // TODO: Just make a trpc endpoint that accept array, if it's one or multiable does the same thing
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
      id: '4',
      name: '#V0ID',
      email: 'hey@v0id.me',
      phone: '+966501760925',
      city: 'جدة',
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
      {/* Show content only if we have data and no errors except 404 which is handled by the empty state */}
      {!isPending && !isFetchingNextPage ? (
        clientsError?.data?.code === 'NOT_FOUND' ? null : clients?.pages?.length ? (
          <>
            <ClientsTable contacts={contacts} onDelete={handleDelete} />

            {/* Pagination | TODO: OFC Make it better like real pagination */}
            {(hasNextPage || (pages && pages > 0)) && (
              <button onClick={() => fetchNextPage()} className="mt-4 text-primary hover:underline">
                تحميل المزيد
              </button>
            )}
          </>
        ) : null
      ) : (
        <Spinner />
      )}
    </DashboardContent>
  );
}
