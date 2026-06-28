import { describe, it, expect, vi } from 'vitest';

vi.mock('./base44/client', () => ({
  auth: {
    me: vi.fn().mockResolvedValue({ email: 'ana@trancoso.com', full_name: 'Ana' }),
    logout: vi.fn().mockResolvedValue(undefined),
  },
  entity: vi.fn(),
}));

import { userService } from './userService';
import { auth } from './base44/client';

describe('userService', () => {
  it('me() delega para a fronteira de auth do Base44', async () => {
    const user = await userService.me();
    expect(auth.me).toHaveBeenCalledOnce();
    expect(user.email).toBe('ana@trancoso.com');
  });

  it('logout() delega para a fronteira de auth do Base44', async () => {
    await userService.logout();
    expect(auth.logout).toHaveBeenCalledOnce();
  });
});
