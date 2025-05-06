export const RESOURCE_TYPES = ['contacts', 'tasks', 'organizations'] as const;

export type ResourceType = (typeof RESOURCE_TYPES)[number];
