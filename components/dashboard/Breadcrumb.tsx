import { Link } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem } from '../ui/breadcrumb';

export function DashboardBreadcrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <Link href="/dashboard">Dashboard</Link>
      </BreadcrumbItem>
    </Breadcrumb>
  );
}
