import { useQuery } from '@tanstack/react-query';
import { providerService } from '@/services/providerService';
import { queryKeys } from '@/lib/query-keys';
import type { ServiceProvider } from '@/services/base44/types';

export function useProviderProfile(email: string | undefined) {
  return useQuery<ServiceProvider[], Error, ServiceProvider | null>({
    queryKey: queryKeys.providerProfile(email),
    queryFn: () => providerService.findByCreator(email as string),
    enabled: !!email,
    select: (data) => data?.[0] ?? null,
  });
}

export function useAllProviders() {
  return useQuery<ServiceProvider[]>({
    queryKey: queryKeys.allProviders,
    queryFn: () => providerService.list(),
    initialData: [],
  });
}
