import { OrganizationMetadata } from '@/interfaces/organization';

declare module 'better-auth' {
  interface Organization {
    metadata: OrganizationMetadata;
  }
}
