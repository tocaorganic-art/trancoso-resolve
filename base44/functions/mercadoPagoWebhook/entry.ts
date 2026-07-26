import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Webhook do Mercado Pago — recebe notificações de pagamento e assinaturas.
//
// Segurança:
//   - Valida assinatura HMAC-SHA256 (MP_WEBHOOK_SECRET OBRIGATÓRIO; ausência = 503)
//   - Idempotência: grava notification_id no MpWebhookLog antes de processar;
//     notificações duplicadas são ignoradas com 200 (MP reenviar é esperado)
//   - payload_snapshot: gravado apenas com campos de metadados seguros (sem PII/financeiro)
//
// Variáveis de ambiente necessárias:
//   MP_ACCESS_TOKEN    — token de acesso MP (para buscar detalhes via API)
//   MP_WEBHOOK_SECRET  — secret para validação HMAC (OBRIGATÓRIO; ausente = falha segura)

const TOPICS_SUPORTADOS = new Set(['payment', 'preapproval', 'merchant_order']);

// Campos seguros para armazenar no snapshot de auditoria.
// Nunca incluir: payer, card, transaction_details, fee_details, personal_data.
const SNAPSHOT_CAMPOS_SEGUROS = new Set([
  'action', 'api_version', 'data', 'date_created',
  'id', 'live_mode', 'type', 'topic', 'user_id',
]);

function sanitizarPayload(raw: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(raw).filter(([k]) => SNAPSHOT_CAMPOS_SEGUROS.has(k))
  );
}

async function validarAssinatura(req: Request, rawBody: string): Promise<{ ok: boolean; erro?: string }> {
  const secret = Deno.env.get('MP_WEBHOOK_SECRET');
  if (!secret) {
    // Ausência da secret é falha de configuração, não falha de autenticação.
    // Retornar 503 (e não 400) para que o MP reencaminhe quando o secret for configurado.
    console.error('[mercadoPagoWebhook] CRÍTICO: MP_WEBHOOK_SECRET não configurado — rejeitando');
    return { ok: false, erro: 'Webhook não configurado corretamente. Configure MP_WEBHOOK_SECRET.' };
  }

  const xSignature = req.headers.get('x-signature');
  const xRequestId = req.headers.get('x-request-id');
  if (!xSignature || !xRequestId) return { ok: false };

  // Formato MP: ts=<timestamp>,v1=<hash>
  const parts = Object.fromEntries(xSignature.split(',').map((p) => p.split('=')));
  const ts = parts['ts'];
  const v1 = parts['v1'];
  if (!ts || !v1) return false;

  const manifest = `id:${xRequestId};request-id:${xRequestId};ts:${ts};`;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(manifest));
  const computed = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return computed === v1 ? { ok: true } : { ok: false };
}

async function buscarPagamentoMP(mpToken: string, paymentId: string): Promise<Record<string, unknown> | null> {
  const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${mpToken}` },
  });
  if (!res.ok) return null;
  return res.json();
}

async function buscarPreapprovalMP(mpToken: string, preapprovalId: string): Promise<Record<string, unknown> | null> {
  const res = await fetch(`https://api.mercadopago.com/preapproval/${preapprovalId}`, {
    headers: { Authorization: `Bearer ${mpToken}` },
  });
  if (!res.ok) return null;
  return res.json();
}

const STATUS_PAYMENT_MAP: Record<string, string> = {
  approved:   'pago',
  authorized: 'autorizado',
  pending:    'pendente',
  in_process: 'em_processamento',
  rejected:   'rejeitado',
  cancelled:  'cancelado',
  refunded:   'reembolsado',
  charged_back: 'chargeback',
};

const STATUS_PREAPPROVAL_MAP: Record<string, string> = {
  authorized: 'ativa',
  pending:    'pendente',
  paused:     'pausada',
  cancelled:  'cancelada',
};

Deno.serve(async (req) => {
  const rawBody = await req.text();

  // --- Validação de assinatura (falha segura) ---
  const validacao = await validarAssinatura(req, rawBody);
  if (!validacao.ok) {
    const statusCode = validacao.erro ? 503 : 400;
    const msg = validacao.erro || 'Assinatura inválida';
    console.error(`[mercadoPagoWebhook] ${msg}`);
    return Response.json({ error: msg }, { status: statusCode });
  }

  const mpToken = Deno.env.get('MP_ACCESS_TOKEN');
  if (!mpToken) {
    console.error('[mercadoPagoWebhook] MP_ACCESS_TOKEN não configurado');
    return Response.json({ error: 'Gateway não configurado' }, { status: 503 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: 'Payload inválido' }, { status: 400 });
  }

  const notificationId = String(payload.id || payload['x-request-id'] || '');
  const topic = String(payload.type || payload.topic || '');
  const resourceId = String((payload.data as Record<string, unknown>)?.id || payload.resource || '');

  if (!notificationId || !TOPICS_SUPORTADOS.has(topic)) {
    // Evento desconhecido ou mal-formado — aceitar para não forçar reenvio
    console.log(`[mercadoPagoWebhook] evento ignorado: topic=${topic} id=${notificationId}`);
    return Response.json({ ok: true, acao: 'ignorado' });
  }

  const base44 = createClientFromRequest(req);

  // --- Idempotência: verifica se já processamos este notification_id ---
  const existentes = await base44.asServiceRole.entities.MpWebhookLog.filter({
    notification_id: notificationId,
  });
  if (existentes && existentes.length > 0 && existentes[0].status !== 'erro') {
    console.log(`[mercadoPagoWebhook] duplicado ignorado: ${notificationId}`);
    await base44.asServiceRole.entities.MpWebhookLog.create({
      notification_id: `${notificationId}-dup-${Date.now()}`,
      topic,
      resource_id: resourceId,
      status: 'duplicado',
      recebido_em: new Date().toISOString(),
    });
    return Response.json({ ok: true, acao: 'duplicado' });
  }

  // --- Grava log antes de processar (idempotência) ---
  // payload_snapshot contém apenas metadados de auditoria (sem PII ou dados financeiros).
  const logEntry = await base44.asServiceRole.entities.MpWebhookLog.create({
    notification_id: notificationId,
    topic,
    resource_id: resourceId,
    status: 'processado',
    payload_snapshot: sanitizarPayload(payload),
    recebido_em: new Date().toISOString(),
  });

  try {
    if (topic === 'payment') {
      await processarPagamento(base44, mpToken, resourceId);
    } else if (topic === 'preapproval') {
      await processarPreapproval(base44, mpToken, resourceId);
    }

    console.log(`[mercadoPagoWebhook] processado: topic=${topic} resource=${resourceId} log=${logEntry?.id}`);
    return Response.json({ ok: true, acao: 'processado', log_id: logEntry?.id });

  } catch (err) {
    console.error(`[mercadoPagoWebhook] erro ao processar ${notificationId}:`, (err as Error).message);

    // Marca o log como erro para permitir reprocessamento
    if (logEntry?.id) {
      await base44.asServiceRole.entities.MpWebhookLog.update(logEntry.id, {
        status: 'erro',
        erro: (err as Error).message,
      });
    }

    // Retorna 500 para o MP reenviar a notificação
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
});

async function processarPagamento(base44: any, mpToken: string, paymentId: string) {
  const mpPayment = await buscarPagamentoMP(mpToken, paymentId);
  if (!mpPayment) {
    console.warn(`[mercadoPagoWebhook] payment ${paymentId} não encontrado na API MP`);
    return;
  }

  const externalRef = String(mpPayment.external_reference || '');
  const [requestId] = externalRef.split('|');
  const novoStatus = STATUS_PAYMENT_MAP[String(mpPayment.status)] || String(mpPayment.status);

  if (!requestId) return;

  // Localiza o Payment no banco via mp_preference_id ou external_reference
  const payments = await base44.asServiceRole.entities.Payment.filter({ request_id: requestId });
  if (!payments || payments.length === 0) {
    console.warn(`[mercadoPagoWebhook] Payment para request_id=${requestId} não encontrado`);
    return;
  }

  const payment = payments[0];

  // Não reverter um pagamento já capturado
  if (payment.status === 'pago' && novoStatus !== 'reembolsado' && novoStatus !== 'chargeback') {
    return;
  }

  await base44.asServiceRole.entities.Payment.update(payment.id, {
    status: novoStatus,
    mp_payment_id: paymentId,
    atualizado_em: new Date().toISOString(),
  });

  // Atualiza ServiceRequest se aprovado
  if (novoStatus === 'pago') {
    await base44.asServiceRole.entities.ServiceRequest.update(requestId, {
      status: 'Em Andamento',
    });
    console.log(`[mercadoPagoWebhook] ServiceRequest ${requestId} → Em Andamento`);
  }

  console.log(`[mercadoPagoWebhook] Payment ${payment.id} → ${novoStatus}`);
}

async function processarPreapproval(base44: any, mpToken: string, preapprovalId: string) {
  const mpPreapproval = await buscarPreapprovalMP(mpToken, preapprovalId);
  if (!mpPreapproval) {
    console.warn(`[mercadoPagoWebhook] preapproval ${preapprovalId} não encontrado`);
    return;
  }

  const externalRef = String(mpPreapproval.external_reference || '');
  const [userId, plano] = externalRef.split('|');
  const novoStatus = STATUS_PREAPPROVAL_MAP[String(mpPreapproval.status)] || String(mpPreapproval.status);

  if (!userId) return;

  const subscriptions = await base44.asServiceRole.entities.Subscription.filter({
    mp_preapproval_id: preapprovalId,
  });

  if (!subscriptions || subscriptions.length === 0) {
    console.warn(`[mercadoPagoWebhook] Subscription para preapproval=${preapprovalId} não encontrada`);
    return;
  }

  await base44.asServiceRole.entities.Subscription.update(subscriptions[0].id, {
    status: novoStatus,
    mp_preapproval_id: preapprovalId,
    atualizado_em: new Date().toISOString(),
  });

  console.log(`[mercadoPagoWebhook] Subscription ${subscriptions[0].id} → ${novoStatus}`);
}
