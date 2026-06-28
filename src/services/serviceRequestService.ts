import { entity } from './base44/client';
import type { ServiceRequest } from './base44/types';

const requests = entity<ServiceRequest>('ServiceRequest');

export const serviceRequestService = {
  listByProvider: (providerId: string): Promise<ServiceRequest[]> =>
    requests.filter({ provider_id: providerId }, '-created_date'),
  listMine: (): Promise<ServiceRequest[]> => requests.filter({}, '-date'),
};
