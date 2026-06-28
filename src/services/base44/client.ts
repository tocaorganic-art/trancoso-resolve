// Fronteira ÚNICA com o @base44/sdk.
// O SDK não traz tipos, então este é o único arquivo onde `any` é tolerado.
// Acima desta camada, tudo é tipado via `./types` e os *Service.ts.
import type { User } from './types';
import { base44 } from '@/api/base44Client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sdk = base44 as any;

export interface Base44Entity<T> {
  list(sort?: string): Promise<T[]>;
  filter(query: Record<string, unknown>, sort?: string): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
}

export function entity<T>(name: string): Base44Entity<T> {
  return {
    list: (sort) => sdk.entities[name].list(sort),
    filter: (query, sort) => sdk.entities[name].filter(query, sort),
    create: (data) => sdk.entities[name].create(data),
    update: (id, data) => sdk.entities[name].update(id, data),
  };
}

export const auth = {
  me: (): Promise<User> => sdk.auth.me(),
  logout: (): Promise<void> => sdk.auth.logout(),
};
