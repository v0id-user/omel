export const SUBSCRIPTION_TIERS = ['free', 'pro', 'enterprise'] as const;

export type SubscriptionTier = (typeof SUBSCRIPTION_TIERS)[number];

export const SUBSCRIPTION_STATUSES = ['active', 'inactive', 'cancelled'] as const;

export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];
