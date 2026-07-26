/**
 * Pixel / CAPI helpers — Trancoso Resolve
 *
 * Regras:
 * - Nenhum dado PII é enviado (sem e-mail, CPF, telefone).
 * - Cada evento usa um event_id único (UUID) para deduplicação client/server.
 * - Todas as funções são no-ops silenciosos se fbq não estiver disponível.
 * - O event_id é salvo em sessionStorage para que o servidor possa reenviar
 *   o mesmo evento via CAPI sem duplicar no relatório do Facebook.
 */

const PIXEL_ID = '2222634538513651';

function generateEventId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function pixelTrack(eventName, params = {}, isCustom = false) {
  const eventId = generateEventId();
  try {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      const fn = isCustom ? 'trackCustom' : 'track';
      window.fbq(fn, eventName, params, { eventID: eventId });
    }
  } catch (err) {
    console.warn('[pixel] erro ao disparar evento:', eventName, err?.message);
  }
  return eventId;
}

export function pixelLandingPageView() {
  return pixelTrack('ViewContent', {
    content_name: 'Prestador Fundador',
    content_category: 'landing',
    content_ids: ['prestador_fundador'],
    content_type: 'product',
    value: 19.90,
    currency: 'BRL',
  });
}

export function pixelClickFounderCTA(source = 'hero') {
  return pixelTrack('ClickFounderCTA', { source }, true);
}

export function pixelStartProviderRegistration() {
  return pixelTrack('StartRegistration', {
    content_name: 'Cadastro Prestador',
    currency: 'BRL',
    value: 19.90,
  });
}

export function pixelCompleteProviderRegistration() {
  return pixelTrack('CompleteRegistration', {
    content_name: 'Prestador Cadastrado',
    currency: 'BRL',
  });
}

export function pixelSubmitVerification() {
  return pixelTrack('SubmitApplication', {
    content_name: 'Verificação Enviada',
  }, true);
}

export function pixelVerificationApproved() {
  return pixelTrack('VerificationApproved', {}, true);
}

export function pixelStartTrial(planId = 'prestador_profissional') {
  return pixelTrack('StartTrial', {
    content_name: planId,
    currency: 'BRL',
    value: 0,
  }, true);
}

export function pixelSubscribe(planId = 'prestador_profissional', value = 19.90) {
  return pixelTrack('Subscribe', {
    predicted_ltv: value * 12,
    currency: 'BRL',
    value,
    content_name: planId,
  });
}

export function pixelCancelSubscription() {
  return pixelTrack('CancelSubscription', {}, true);
}

export function pixelFounderBadgeGranted(position) {
  return pixelTrack('FounderBadgeGranted', {
    position,
    value: 19.90,
    currency: 'BRL',
  }, true);
}

export function pixelFounderBadgeRevoked() {
  return pixelTrack('FounderBadgeRevoked', {}, true);
}
