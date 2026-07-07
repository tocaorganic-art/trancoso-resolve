import { entity } from './base44/client';
import type { ServiceProvider } from './base44/types';

const providers = entity<ServiceProvider>('ServiceProvider');

export const providerService = {
  list: (): Promise<ServiceProvider[]> => providers.list(),
  findByCreator: (email: string): Promise<ServiceProvider[]> =>
    providers.filter({ created_by: email }),
};
