import { useQuery } from '@tanstack/react-query';
import { paymentService } from '@/services/paymentService';
import { queryKeys } from '@/lib/query-keys';
import type { Payment } from '@/services/base44/types';

export function useMyPayments(email: string | undefined) {
  return useQuery<Payment[]>({
    queryKey: queryKeys.myPayments(email),
    queryFn: () => paymentService.listByClient(email as string),
    enabled: !!email,
    initialData: [],
  });
}
