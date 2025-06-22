import { trpc } from '@/trpc/server';
import { Suspense } from 'react';
import ClientsPage from './ClientPage';
import { Spinner } from '@/components/omel/Spinner';

export default async function ClientsPageServer() {
  // Prefetch the data on the server
  await trpc.crm.dashboard.contact.getByPage.prefetch({
    limit: 10,
    page: 1,
  });

  return (
    <Suspense fallback={<Spinner />}>
      <ClientsPage />
    </Suspense>
  );
}
