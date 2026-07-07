import { useQuery } from '@tanstack/react-query';
import { reviewService } from '@/services/reviewService';
import { queryKeys } from '@/lib/query-keys';
import type { ServiceReview } from '@/services/base44/types';
import type { User } from '@/services/base44/types';

export function useMyReviews(user: User | undefined) {
  return useQuery<ServiceReview[]>({
    queryKey: queryKeys.myReviews(user?.id),
    queryFn: () => reviewService.listByCreator(user?.email as string),
    enabled: !!user,
    initialData: [],
  });
}
