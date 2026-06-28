import { entity } from './base44/client';
import type { Transaction } from './base44/types';

const transactions = entity<Transaction>('Transaction');

export const transactionService = {
  listAll: (): Promise<Transaction[]> => transactions.filter({}, '-created_date'),
};
