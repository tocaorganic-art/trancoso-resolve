import { useQuery } from '@tanstack/react-query';
import { subscriptionService } from '@/services/subscriptionService';
import { queryKeys } from '@/lib/query-keys';
import { findActiveSubscription, todayISO } from '@/domain/subscription';
import type { Subscription } from '@/services/base44/types';

export function useActiveSubscription(email: string | undefined) {
  return useQuery<Subscription | null>({
    queryKey: queryKeys.activeSubscription(email),
    queryFn: async () => {
      if (!email) return null;
      const subs = await subscriptionService.listByEmail(email);
      return findActiveSubscription(subs, todayISO());
    },
    enabled: !!email,
  });
}

export function useAllSubscriptions(email: string | undefined) {
  return useQuery<Subscription[]>({
    queryKey: queryKeys.allSubscriptions(email),
    queryFn: () => (email ? subscriptionService.listByEmail(email) : Promise.resolve([])),
    enabled: !!email,
  });
}
