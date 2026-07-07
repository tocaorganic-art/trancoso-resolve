import { auth } from './base44/client';
import type { User } from './base44/types';

export const userService = {
  me: (): Promise<User> => auth.me(),
  logout: (): Promise<void> => auth.logout(),
};
