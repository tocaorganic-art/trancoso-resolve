// Fábrica central de query keys do React Query.
// IMPORTANTE: as chaves batem 1:1 com as usadas hoje inline nas páginas,
// para preservar a deduplicação de cache durante a migração incremental.

export const queryKeys = {
  currentUser: ['currentUser'] as const,
  activeSubscription: (email?: string) => ['mySubscription', email] as const,
  allSubscriptions: (email?: string) => ['allMySubscriptions', email] as const,
  providerProfile: (email?: string) => ['myProviderProfile', email] as const,
  allProviders: ['allProviders'] as const,
  serviceRequestsByProvider: (providerId?: string) =>
    ['serviceRequests', providerId] as const,
  myServiceRequests: (email?: string) => ['myServiceRequests', email] as const,
  transactions: (email?: string) => ['transactions', email] as const,
  myReviews: (userId?: string) => ['myReviews', userId] as const,
  myPayments: (email?: string) => ['myPayments', email] as const,
};
