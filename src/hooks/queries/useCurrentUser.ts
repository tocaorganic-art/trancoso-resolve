import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { userService } from '@/services/userService';
import { queryKeys } from '@/lib/query-keys';
import type { User } from '@/services/base44/types';

type Options = Omit<UseQueryOptions<User>, 'queryKey' | 'queryFn'>;

export function useCurrentUser(options?: Options) {
  return useQuery<User>({
    queryKey: queryKeys.currentUser,
    queryFn: () => userService.me(),
    ...options,
  });
}
