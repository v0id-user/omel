import { trpc } from '@/trpc/server';
import ClientsPage from './ClientPage';

export default function ClientsPageServer() {
  trpc.crm.dashboard.contact.pages.prefetch({
    length: 10,
  });
  return <ClientsPage />;
}
