import TasksPage from './ClientPage';
import { trpc } from '@/trpc/server';

export default async function TasksPageWrapper() {
  await trpc.crm.dashboard.contact.getBulk.prefetch({
    limit: 50,
  });

  return <TasksPage />;
}
