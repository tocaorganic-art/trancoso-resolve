import { entity } from './base44/client';
import type { Subscription } from './base44/types';

const subscriptions = entity<Subscription>('Subscription');

export const subscriptionService = {
  listByEmail: (email: string): Promise<Subscription[]> =>
    subscriptions.filter({ user_email: email }),
};
