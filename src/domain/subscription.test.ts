import { describe, it, expect } from 'vitest';
import { isSubscriptionActive, findActiveSubscription, todayISO } from './subscription';

const TODAY = '2026-06-28';

describe('isSubscriptionActive', () => {
  it('considera active sem data de cobrança como ativa', () => {
    expect(isSubscriptionActive({ status: 'active' }, TODAY)).toBe(true);
  });

  it('considera active com cobrança futura como ativa', () => {
    expect(isSubscriptionActive({ status: 'active', next_billing_date: '2026-07-10' }, TODAY)).toBe(true);
  });

  it('considera active vencida (cobrança no passado) como inativa', () => {
    expect(isSubscriptionActive({ status: 'active', next_billing_date: '2026-06-01' }, TODAY)).toBe(false);
  });

  it('considera trial dentro do prazo como ativa', () => {
    expect(isSubscriptionActive({ status: 'trial', trial_end: '2026-06-30' }, TODAY)).toBe(true);
  });

  it('considera trial no último dia como ativa (inclusivo)', () => {
    expect(isSubscriptionActive({ status: 'trial', trial_end: TODAY }, TODAY)).toBe(true);
  });

  it('considera trial expirado como inativa', () => {
    expect(isSubscriptionActive({ status: 'trial', trial_end: '2026-06-01' }, TODAY)).toBe(false);
  });

  it('considera trial sem trial_end como inativa', () => {
    expect(isSubscriptionActive({ status: 'trial' }, TODAY)).toBe(false);
  });

  it('considera status desconhecido/cancelado como inativa', () => {
    expect(isSubscriptionActive({ status: 'canceled' }, TODAY)).toBe(false);
    expect(isSubscriptionActive({}, TODAY)).toBe(false);
  });
});

describe('findActiveSubscription', () => {
  it('retorna a primeira assinatura ativa da lista', () => {
    const subs = [
      { status: 'canceled' },
      { status: 'trial', trial_end: '2026-06-30' },
      { status: 'active' },
    ];
    expect(findActiveSubscription(subs, TODAY)).toBe(subs[1]);
  });

  it('retorna null quando nenhuma é ativa', () => {
    expect(findActiveSubscription([{ status: 'canceled' }], TODAY)).toBeNull();
  });

  it('retorna null para lista vazia, null ou undefined', () => {
    expect(findActiveSubscription([], TODAY)).toBeNull();
    expect(findActiveSubscription(null, TODAY)).toBeNull();
    expect(findActiveSubscription(undefined, TODAY)).toBeNull();
  });
});

describe('todayISO', () => {
  it('retorna data no formato YYYY-MM-DD', () => {
    expect(todayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
