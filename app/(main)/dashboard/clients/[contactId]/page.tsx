import { ContactDetailsPage } from '@/features/crm/contacts/ui/ContactDetailsPage';

export default async function ContactDetailsRoute({
  params,
}: {
  params: Promise<{ contactId: string }>;
}) {
  const { contactId } = await params;

  return <ContactDetailsPage contactId={contactId} />;
}
