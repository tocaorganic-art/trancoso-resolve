import { useQuery } from '@tanstack/react-query';
import { transactionService } from '@/services/transactionService';
import { queryKeys } from '@/lib/query-keys';
import type { Transaction } from '@/services/base44/types';

export function useTransactions(email: string | undefined) {
  return useQuery<Transaction[]>({
    queryKey: queryKeys.transactions(email),
    queryFn: () => transactionService.listAll(),
    enabled: !!email,
    initialData: [],
  });
}
