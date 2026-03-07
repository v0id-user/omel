export type CRMCreationResult = {
  data: {
    organizationId: string;
    organizationSlug: string;
    userId: string;
    status: 'ok';
  };
  headers: Record<string, string>;
};
