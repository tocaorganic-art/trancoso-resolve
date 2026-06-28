import { entity } from './base44/client';
import type { ServiceReview } from './base44/types';

const reviews = entity<ServiceReview>('ServiceReview');

export const reviewService = {
  listByCreator: (email: string): Promise<ServiceReview[]> =>
    reviews.filter({ created_by: email }),
};
