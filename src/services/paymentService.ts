import { entity } from './base44/client';
import type { Payment } from './base44/types';

const payments = entity<Payment>('Payment');

export const paymentService = {
  listByClient: (email: string): Promise<Payment[]> =>
    payments.filter({ client_email: email }),
};
