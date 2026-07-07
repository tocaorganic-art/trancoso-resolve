import { useQuery } from '@tanstack/react-query';
import { serviceRequestService } from '@/services/serviceRequestService';
import { queryKeys } from '@/lib/query-keys';
import type { ServiceRequest } from '@/services/base44/types';

export function useServiceRequestsByProvider(providerId: string | undefined) {
  return useQuery<ServiceRequest[]>({
    queryKey: queryKeys.serviceRequestsByProvider(providerId),
    queryFn: () => serviceRequestService.listByProvider(providerId as string),
    enabled: !!providerId,
  });
}

export function useMyServiceRequests(email: string | undefined) {
  return useQuery<ServiceRequest[]>({
    queryKey: queryKeys.myServiceRequests(email),
    queryFn: () => serviceRequestService.listMine(),
    enabled: !!email,
    initialData: [],
  });
}
