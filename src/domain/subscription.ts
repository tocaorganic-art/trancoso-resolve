// Regra de negócio pura de assinatura — sem React, sem rede, 100% testável.
// Extraída do queryFn inline de src/pages/Dashboard.jsx.

export interface SubscriptionLike {
  status?: string;
  next_billing_date?: string | null;
  trial_end?: string | null;
}

// Data de hoje em formato ISO (YYYY-MM-DD), para comparação lexicográfica de datas.
export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

// Uma assinatura é ativa se está 'active' (e não venceu) ou em 'trial' válido.
export function isSubscriptionActive(sub: SubscriptionLike, today: string): boolean {
  if (sub.status === 'active') {
    if (sub.next_billing_date && today > sub.next_billing_date) return false;
    return true;
  }
  if (sub.status === 'trial') {
    return Boolean(sub.trial_end && today <= sub.trial_end);
  }
  return false;
}

// Primeira assinatura ativa da lista, ou null.
export function findActiveSubscription<T extends SubscriptionLike>(
  subs: T[] | null | undefined,
  today: string,
): T | null {
  return subs?.find((sub) => isSubscriptionActive(sub, today)) ?? null;
}
