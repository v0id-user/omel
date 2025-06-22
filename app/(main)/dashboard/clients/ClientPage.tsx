'use client';

import { DashboardContent } from '@/components/dashboard';
import { UserPlus } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { AddClientsDialog } from './dialog';
import { EditContactsDialog } from './EditContactsDialog';
import AddGroup from '@/public/icons/iso/add-group.svg';
import { ClientsTable } from './components';
import { trpc } from '@/trpc/client';
import { Spinner } from '@/components/omel/Spinner';
import { toast } from 'react-hot-toast';
import { Pagination } from '@/components/ui/pagination';
import { log } from '@/utils/logs';

export default function ClientsPage() {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageLimit = 10;

  // Page-based query
  const {
    data: paginatedClients,
    error: clientsError,
    isPending,
  } = trpc.crm.dashboard.contact.getByPage.useQuery(
    {
      page: currentPage,
      limit: pageLimit,
    },
    {
      retry: (failureCount, error) => {
        return error?.data?.code !== 'NOT_FOUND' && failureCount < 3;
      },
    }
  );

  // Extract clients data
  const clients = paginatedClients?.data;

  // Handle error toast in useEffect
  useEffect(() => {
    if (clientsError && clientsError.data?.code !== 'NOT_FOUND') {
      toast.error(clientsError.message);
    }
  }, [clientsError]);

  const handleEdit = (ids: string[]) => {
    console.log(
      log({
        component: 'ClientsPage',
        message: 'handleEdit called with ids:' + ids,
      })
    );
    setSelectedContactIds(ids);
    setEditDialogOpen(true);
    console.log(
      log({
        component: 'ClientsPage',
        message: 'Edit dialog should be open now',
      })
    );
  };

  const handleDelete = (ids: string[]) => {
    // TODO: Just make a trpc endpoint that accept array, if it's one or multiable does the same thing
    // Implement bulk delete logic
    console.log('Deleting:', ids);
  };

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
      dialogs={
        <>
          {isDialogOpen && (
            <AddClientsDialog
              isOpen={isDialogOpen}
              onClose={() => {
                setDialogOpen(false);
              }}
            />
          )}
          {isEditDialogOpen && (
            <EditContactsDialog
              isOpen={isEditDialogOpen}
              onClose={() => {
                setEditDialogOpen(false);
                setSelectedContactIds([]);
              }}
              contactIds={selectedContactIds}
            />
          )}
        </>
      }
    >
      {isPending ? (
        <Spinner />
      ) : clientsError?.data?.code === 'NOT_FOUND' ? null : clients && clients.length > 0 ? (
        <>
          <ClientsTable data={clients} onEdit={handleEdit} onDelete={handleDelete} />

          {/* Pagination */}
          {paginatedClients && (
            <Pagination
              currentPage={currentPage}
              totalPages={paginatedClients.totalPages}
              onPageChange={setCurrentPage}
              isLoading={isPending}
            />
          )}
        </>
      ) : null}
    </DashboardContent>
  );
}
